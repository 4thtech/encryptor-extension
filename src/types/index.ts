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
  GET_ENCRYPTOR_STATE = 'getEncryptorState',
  GET_PUBLIC_KEY = 'getPublicKey',
  COMPUTE_SHARED_SECRET_KEY = 'computeSharedSecretKey',
  EMIT_HEARTBEAT = 'emitHeartbeat',
  EMIT_ENCRYPTOR_STATE_CHANGE = 'emitEncryptorStateChange',
}

export enum EventName {
  BLOCK_LABS_ENCRYPTOR_ERROR = 'block_labs_encryptor_error',
  BLOCK_LABS_ENCRYPTOR_HANDSHAKE = 'block_labs_encryptor_handshake',
  BLOCK_LABS_ENCRYPTOR_HEARTBEAT = 'block_labs_encryptor_heartbeat',
  BLOCK_LABS_ENCRYPTOR_RESPONSE = 'block_labs_encryptor_response',
  BLOCK_LABS_ENCRYPTOR_REQUEST = 'block_labs_encryptor_request',
  BLOCK_LABS_ENCRYPTOR_STATE_CHANGE = 'block_labs_encryptor_state_change',
}
