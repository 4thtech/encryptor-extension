class ContentScript {
  constructor() {
    this.addEventListeners();
  }

  private postMessageToWindow(type: string, response?: any): void {
    window.postMessage({ type, response }, window.location.origin);
  }

  private async sendRequestToBackground(event: Event): Promise<void> {
    const request = event as CustomEvent<{ detail: any }>;

    try {
      const response = await chrome.runtime.sendMessage({ detail: request.detail });
      this.postMessageToWindow('block_labs_encryptor_response', response);
    } catch (error) {
      this.postMessageToWindow('block_labs_encryptor_error', error);
    }
  }

  private addEventListeners(): void {
    document.addEventListener('block_labs_encryptor_handshake', () =>
      this.postMessageToWindow('block_labs_encryptor_handshake'),
    );

    document.addEventListener('block_labs_encryptor_request', (event) =>
      this.sendRequestToBackground(event),
    );
  }
}

new ContentScript();

export {};
