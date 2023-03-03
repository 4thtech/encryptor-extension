/**
 * Use the `block_labs_encryptor` methods listed below to issue requests to the 4th encryptor.
 */
var blockLabsEncryptor = {
  current_id: 1,
  requests: {},
  handshake_callback: null,

  requestHandshake: function (callback) {
    this.handshake_callback = callback;
    this.dispatchCustomEvent('block_labs_encryptor_handshake', '');
  },

  getPublicKey: function (callback) {
    const request = {
      type: 'getPublicKey',
    };
    this.dispatchCustomEvent('block_labs_encryptor_request', request, callback);
  },

  computeSharedSecretKey: function (publicKey, callback) {
    const request = {
      type: 'computeSharedSecretKey',
      publicKey
    };
    this.dispatchCustomEvent('block_labs_encryptor_request', request, callback);
  },

  // Send the customEvent
  dispatchCustomEvent: function (name, data, callback) {
    this.requests[this.current_id] = callback;
    data = Object.assign(
      {
        request_id: this.current_id,
      },
      data,
    );
    document.dispatchEvent(
      new CustomEvent(name, {
        detail: data,
      }),
    );

    this.current_id++;
  },
};

window.addEventListener(
  'message',
  function (event) {
    // We only accept messages from ourselves
    if (event.source !== window) return;
    if (event.data.type && event.data.type === 'block_labs_encryptor_response') {
      const response = event.data.response;
      if (response && response.request_id) {
        if (blockLabsEncryptor.requests[response.request_id]) {
          blockLabsEncryptor.requests[response.request_id](response);
        }
      }
    } else if (
      event.data.type &&
      event.data.type === 'block_labs_encryptor_handshake'
    ) {
      if (blockLabsEncryptor.handshake_callback) {
        blockLabsEncryptor.handshake_callback();
      }
    }
  },
  false,
);
