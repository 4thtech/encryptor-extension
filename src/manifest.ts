import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  name: 'Encryptor',
  description:
    'Encryptor adds support for the encryption layer currently not supported in major Web3 wallets.',
  version: '0.0.1',
  manifest_version: 3,
  icons: {
    16: 'public/icons/logo-16.png',
    32: 'public/icons/logo-32.png',
    48: 'public/icons/logo-48.png',
    128: 'public/icons/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'public/icons/logo-48.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.ts'],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'public/icons/logo-16.png',
        'public/icons/logo-32.png',
        'public/icons/logo-48.png',
        'public/icons/logo-128.png',
        'src/js/block_labs_encryptor.js',
      ],
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['storage'],
});
