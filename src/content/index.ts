const setupInjection = () => {
  try {
    const scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL('src/js/block_labs_encryptor.js');
    const container = document.head || document.documentElement;
    container.insertBefore(scriptTag, container.children[0]);
  } catch (e) {
    console.log('blockLabs injection failed.', e);
  }
};

const sendRequestToBackground = async (request: any) => {
  const response = await chrome.runtime.sendMessage({ detail: request.detail });
  window.postMessage(
    {
      type: 'block_labs_encryptor_response',
      response,
    },
    window.location.origin,
  );
};

document.addEventListener('block_labs_encryptor_handshake', () => {
  window.postMessage(
    {
      type: 'block_labs_encryptor_handshake',
    },
    window.location.origin,
  );
});

document.addEventListener('block_labs_encryptor_request', (request) => {
  sendRequestToBackground(request);
});

setupInjection();

export {};
