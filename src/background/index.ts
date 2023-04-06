import { ethers, HDNodeWallet } from 'ethers';
import { MessageType, WalletState } from '@/types';

class BackgroundScript {
  private wallet?: HDNodeWallet;

  constructor() {
    this.addListener();
  }

  private async storeEncryptedWallet(wallet: HDNodeWallet, password: string): Promise<void> {
    const encryptedWallet = await wallet.encrypt(password);
    await chrome.storage.local.set({ encryptedWallet });
  }

  private async getEncryptedWallet(): Promise<string | undefined> {
    const { encryptedWallet } = await chrome.storage.local.get();
    return encryptedWallet;
  }

  public async getWalletState(): Promise<WalletState> {
    if (this.wallet) {
      return WalletState.UNLOCKED;
    }

    return (await this.getEncryptedWallet()) ? WalletState.LOCKED : WalletState.NOT_GENERATED;
  }

  public lockWallet() {
    this.wallet = undefined;
  }

  public async createNewWallet(password: string): Promise<HDNodeWallet> {
    const wallet = ethers.Wallet.createRandom();
    await this.storeEncryptedWallet(wallet, password);
    this.wallet = wallet;

    return this.wallet;
  }

  private async unlockWallet(password: string): Promise<HDNodeWallet | undefined> {
    const encryptedWallet = await this.getEncryptedWallet();

    if (!encryptedWallet) return undefined;

    this.wallet = (await ethers.Wallet.fromEncryptedJson(encryptedWallet, password).catch(
      () => undefined,
    )) as HDNodeWallet;

    return this.wallet;
  }

  private async restoreWallet(seeds: string, password: string): Promise<HDNodeWallet | undefined> {
    let wallet: HDNodeWallet;
    try {
      wallet = await ethers.Wallet.fromPhrase(seeds);
    } catch (e) {
      return undefined;
    }

    await this.storeEncryptedWallet(wallet, password);
    this.wallet = wallet;

    return this.wallet;
  }

  private addListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      (async () => {
        await this.messageHandler(request, sendResponse);
      })();
      return true;
    });
  }

  private async messageHandler(request: any, sendResponse: (response: any) => void): Promise<void> {
    const messageType = request.msg ?? request.detail?.type;

    switch (messageType) {
      case MessageType.CREATE_NEW_WALLET:
        sendResponse(await this.createNewWallet(request.data.password));
        break;

      case MessageType.UNLOCK_WALLET:
        sendResponse(await this.unlockWallet(request.data.password));
        break;

      case MessageType.RESTORE_WALLET:
        sendResponse(await this.restoreWallet(request.data.seeds, request.data.password));
        break;

      case MessageType.GET_WALLET:
        sendResponse({ wallet: this.wallet, state: await this.getWalletState() });
        break;

      case MessageType.LOCK_WALLET:
        this.lockWallet();
        break;

      case MessageType.GET_ENCRYPTOR_STATE:
        sendResponse({ state: await this.getWalletState(), request_id: request.detail.request_id });
        break;

      case MessageType.GET_PUBLIC_KEY:
        if (!this.wallet) return;
        sendResponse({ publicKey: this.wallet.publicKey, request_id: request.detail.request_id });
        break;

      case MessageType.COMPUTE_SHARED_SECRET_KEY:
        if (!this.wallet) return;
        const sharedSecret = this.wallet.signingKey.computeSharedSecret(request.detail.publicKey);
        sendResponse({ sharedSecret, request_id: request.detail.request_id });
        break;

      default:
        sendResponse({ message: 'Requested action is not supported.' });
        break;
    }
  }
}

new BackgroundScript();
