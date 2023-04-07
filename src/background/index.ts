import { ethers, HDNodeWallet } from 'ethers';
import { MessageType, WalletState } from '@/types';

class BackgroundScript {
  private wallet?: HDNodeWallet;

  constructor() {
    this.tryToUnlock().then();
    this.addListener();
  }

  private async tryToUnlock(): Promise<void> {
    const encryptionPassword = await this.getEncryptionPassword();
    if (!encryptionPassword) {
      return;
    }

    await this.unlockWallet(encryptionPassword);
  }

  private async storeEncryptedWallet(wallet: HDNodeWallet, password: string): Promise<void> {
    const encryptedWallet = await wallet.encrypt(password);
    await chrome.storage.local.set({ encryptedWallet });
    await this.storeEncryptionPassword(password);
  }

  private async storeEncryptionPassword(encryptionPassword: string): Promise<void> {
    await chrome.storage.session.set({ encryptionPassword });
  }

  private async getEncryptedWallet(): Promise<string | undefined> {
    const { encryptedWallet } = await chrome.storage.local.get();
    return encryptedWallet;
  }

  private async getEncryptionPassword(): Promise<string | undefined> {
    const { encryptionPassword } = await chrome.storage.session.get();
    return encryptionPassword;
  }

  private async getWalletState(): Promise<WalletState> {
    if (this.wallet) {
      return WalletState.UNLOCKED;
    }

    const encryptedWallet = await this.getEncryptedWallet();

    if (encryptedWallet) {
      await this.tryToUnlock();
      return this.wallet ? WalletState.UNLOCKED : WalletState.LOCKED;
    }

    return WalletState.NOT_GENERATED;
  }

  private async lockWallet(): Promise<boolean> {
    this.wallet = undefined;
    await chrome.storage.session.clear();
    return true;
  }

  private async createNewWallet(password: string): Promise<HDNodeWallet> {
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

    await this.storeEncryptionPassword(password);

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
        sendResponse({ wallet: this.wallet });
        break;

      case MessageType.LOCK_WALLET:
        sendResponse(await this.lockWallet());
        break;

      case MessageType.GET_ENCRYPTOR_STATE:
        sendResponse({
          state: await this.getWalletState(),
          request_id: request.detail?.request_id,
        });
        break;

      case MessageType.GET_PUBLIC_KEY:
        sendResponse({ publicKey: this.wallet?.publicKey, request_id: request.detail.request_id });
        break;

      case MessageType.COMPUTE_SHARED_SECRET_KEY:
        const sharedSecret = this.wallet?.signingKey.computeSharedSecret(request.detail.publicKey);
        sendResponse({ sharedSecret, request_id: request.detail.request_id });
        break;

      default:
        sendResponse({ message: 'Requested action is not supported.' });
        break;
    }
  }
}

new BackgroundScript();
