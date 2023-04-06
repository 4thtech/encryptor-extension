declare global {
  interface Window {
    blockLabsEncryptor: BlockLabsEncryptor;
  }
}

type RequestCallback = (response: any) => void;

class BlockLabsEncryptor {
  private currentId = 1;
  private requests: Record<number, RequestCallback> = {};
  private handshakeCallback: (() => void) | null = null;

  constructor() {
    this.setupEventListener();
  }

  public requestHandshake(callback: () => void): void {
    this.handshakeCallback = callback;
    this.dispatchCustomEvent('block_labs_encryptor_handshake', '');
  }

  public getPublicKey(callback: RequestCallback): void {
    this.dispatchCustomEvent('block_labs_encryptor_request', { type: 'getPublicKey' }, callback);
  }

  public computeSharedSecretKey(publicKey: string, callback: RequestCallback): void {
    this.dispatchCustomEvent(
      'block_labs_encryptor_request',
      { type: 'computeSharedSecretKey', publicKey },
      callback,
    );
  }

  private dispatchCustomEvent(name: string, data: any, callback?: RequestCallback): void {
    if (callback) {
      this.requests[this.currentId] = callback;
    }
    data = { ...data, request_id: this.currentId };
    document.dispatchEvent(new CustomEvent(name, { detail: data }));

    this.currentId++;
  }

  private setupEventListener(): void {
    window.addEventListener(
      'message',
      (event: MessageEvent) => {
        if (event.source !== window) return;

        const { type, response } = event.data;

        switch (type) {
          case 'block_labs_encryptor_response':
            this.requests[response.request_id]?.(response);
            break;
          case 'block_labs_encryptor_handshake':
            this.handshakeCallback?.();
            break;
        }
      },
      false,
    );
  }
}

window.blockLabsEncryptor = new BlockLabsEncryptor();

export {};
