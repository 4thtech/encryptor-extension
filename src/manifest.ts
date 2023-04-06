import { defineManifest } from '@crxjs/vite-plugin';
import { version } from '../package.json';

const isProduction = process.env.NODE_ENV === 'production';
const [major, minor, patch] = version.replace(/[^\d.-]+/g, '').split(/[.-]/);

export default defineManifest({
  name: 'Encryptor',
  description:
    'Encryptor adds support for the encryption layer currently not supported in major Web3 wallets.',
  version: `${major}.${minor}.${patch}`,
  manifest_version: 3,
  icons: {
    16: 'icons/logo-16.png',
    32: 'icons/logo-32.png',
    48: 'icons/logo-48.png',
    128: 'icons/logo-128.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'icons/logo-48.png',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.ts', isProduction ? '' : 'src/inject/block-labs-encryptor.ts'].filter(
        (value) => value !== '',
      ),
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        'icons/logo-16.png',
        'icons/logo-32.png',
        'icons/logo-48.png',
        'icons/logo-128.png',
        isProduction ? 'assets/inject.js' : '',
      ].filter((value) => value !== ''),
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['storage'],
});
