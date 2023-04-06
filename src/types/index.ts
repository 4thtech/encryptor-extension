export enum WalletState {
  NOT_GENERATED = 'not-generated',
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
}

export enum MessageType {
  CREATE_NEW_WALLET = 'createNewWallet',
  UNLOCK_WALLET = 'unlockWallet',
  RESTORE_WALLET = 'restoreWallet',
  GET_WALLET = 'getWallet',
  LOCK_WALLET = 'lockWallet',
  GET_PUBLIC_KEY = 'getPublicKey',
  COMPUTE_SHARED_SECRET_KEY = 'computeSharedSecretKey',
}
