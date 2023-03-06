import { ethers } from 'ethers';
import { HDNodeWallet } from 'ethers';

const wallet = new (class {
  protected wallet: HDNodeWallet | undefined;
  protected locked: boolean | undefined;
  constructor() {
    chrome.storage.session.get().then((data: { [key: string]: any }) => {
      if (data?.phrase) {
        this.wallet = ethers.Wallet.fromPhrase(data.phrase);
        this.locked = false;
      } else {
        chrome.storage.local.get().then((data: { [key: string]: any }) => {
          if (data?.wallet) {
            this.locked = true;
          }
        });
      }
    });

    this.addListener();
  }

  public async createNewWallet(password: string): Promise<HDNodeWallet> {
    this.wallet = ethers.Wallet.createRandom();
    const encryptedWallet = await this.wallet.encrypt(password);
    await chrome.storage.local.set({ wallet: encryptedWallet });
    chrome.storage.session.set({phrase: this.wallet.mnemonic?.phrase});
    this.locked = false;
    return this.wallet;
  }

  public lockWallet() {
    chrome.storage.session.clear();
    this.wallet = undefined;
    this.locked = true;
  }

  public async unlockWallet(password: string): Promise<HDNodeWallet | undefined> {
    const data = await chrome.storage.local.get();
    if (data.wallet) {
      try {
        this.wallet = (await ethers.Wallet.fromEncryptedJson(
          data.wallet,
          password,
        )) as HDNodeWallet;
        this.locked = false;
        chrome.storage.session.set({phrase: this.wallet.mnemonic?.phrase});
        return this.wallet;
      } catch (e) {
        return undefined;
      }
    }
  }

  public async restoreWallet(seeds: string, password: string): Promise<HDNodeWallet | undefined> {
    try {
      this.wallet = await ethers.Wallet.fromPhrase(seeds);
      const encryptedWallet = await this.wallet.encrypt(password);
      this.locked = false;
      await chrome.storage.local.set({ wallet: encryptedWallet });
      chrome.storage.session.set({phrase: this.wallet.mnemonic?.phrase});
      return this.wallet;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }

  private addListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.msg === 'createNewWallet') {
        (async () => {
          const wallet = await this.createNewWallet(request.data.password);
          sendResponse(wallet);
        })();
        return true;
      } else if (request.msg === 'unlockWallet') {
        (async () => {
          const key = await this.unlockWallet(request.data.password);
          sendResponse(key);
        })();
        return true;
      } else if (request.msg === 'restoreWallet') {
        (async () => {
          const key = await this.restoreWallet(request.data.seeds, request.data.password);
          sendResponse(key);
        })();
        return true;
      } else if (request.msg === 'getWallet') {
        (async () => {
          await chrome.storage.local.get();
          sendResponse({ wallet: this.wallet, locked: this.locked });
        })();
        return true;
      } else if (request.msg === 'lockWallet') {
        this.lockWallet();
      }

      if (!this.wallet) return;

      if (request.detail?.type === 'getPublicKey') {
        sendResponse({ publicKey: this.wallet.publicKey, request_id: request.detail.request_id });
      } else if (request.detail?.type === 'computeSharedSecretKey') {
        const sharedSecret = this.wallet.signingKey.computeSharedSecret(request.detail.publicKey);
        sendResponse({ sharedSecret, request_id: request.detail.request_id });
      }
    });
  }
})();

export {};
