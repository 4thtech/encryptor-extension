class ContentScript {
  constructor() {
    this.injectScript();
    this.addEventListeners();
  }

  private injectScript(): void {
    const developmentPath = 'src/inject/block-labs-encryptor.ts.js';
    const productionPath = 'assets/inject.js';
    const injectedScriptUrl = chrome.runtime.getURL(
      import.meta.env.DEV ? developmentPath : productionPath,
    );

    try {
      const scriptTag = document.createElement('script');
      scriptTag.src = injectedScriptUrl;
      (document.head || document.documentElement).appendChild(scriptTag);
    } catch (e) {
      console.error('Encryptor injection failed.', e);
    }
  }

  private postMessageToWindow(type: string, response?: any): void {
    window.postMessage({ type, response }, window.location.origin);
  }

  private async sendRequestToBackground(event: Event): Promise<void> {
    const request = event as CustomEvent<{ detail: any }>;
    const response = await chrome.runtime.sendMessage({ detail: request.detail });
    this.postMessageToWindow('block_labs_encryptor_response', response);
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
