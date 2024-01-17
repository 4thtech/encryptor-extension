import { EventName, MessageType } from '@/types';

class ContentScript {
  constructor() {
    this.addEncryptorInfoToDom();
    this.addEventListeners();
    this.addMessageListeners();
  }

  private addEncryptorInfoToDom(): void {
    const elementId = 'block-labs-encryptor-extension';
    let element = document.getElementById(elementId);

    if (!element) {
      element = document.createElement('div');
      element.id = elementId;
      element.style.display = 'none';
      document.body.appendChild(element);
    }

    element.setAttribute('data-version', import.meta.env.APP_VERSION);
  }

  private postMessageToWindow(type: string, response?: any): void {
    window.postMessage({ type, response }, window.location.origin);
  }

  private async sendRequestToBackground(event: Event): Promise<void> {
    const request = event as CustomEvent<{ detail: any }>;

    try {
      const response = await chrome.runtime.sendMessage({ detail: request.detail });
      this.postMessageToWindow(EventName.BLOCK_LABS_ENCRYPTOR_RESPONSE, response);
    } catch (error) {
      this.postMessageToWindow(EventName.BLOCK_LABS_ENCRYPTOR_ERROR, error);
    }
  }

  private addEventListeners(): void {
    document.addEventListener(EventName.BLOCK_LABS_ENCRYPTOR_HANDSHAKE, () =>
      this.postMessageToWindow(EventName.BLOCK_LABS_ENCRYPTOR_HANDSHAKE),
    );

    document.addEventListener(EventName.BLOCK_LABS_ENCRYPTOR_REQUEST, (event) =>
      this.sendRequestToBackground(event),
    );
  }

  private addMessageListeners(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case MessageType.EMIT_HEARTBEAT:
          this.dispatchCustomEvent(EventName.BLOCK_LABS_ENCRYPTOR_HEARTBEAT, message.data);
          break;
        case MessageType.EMIT_ENCRYPTOR_STATE_CHANGE:
          this.dispatchCustomEvent(EventName.BLOCK_LABS_ENCRYPTOR_STATE_CHANGE, message.data);
          break;
      }
    });
  }

  private dispatchCustomEvent(name: string, data?: {}): void {
    document.dispatchEvent(
      new CustomEvent(name, {
        detail: data,
      }),
    );
  }
}

new ContentScript();

export {};
