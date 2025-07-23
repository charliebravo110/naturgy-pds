declare global {
  interface Window {
    msCrypto: Crypto
  }
}

export const foo = 'foo'
