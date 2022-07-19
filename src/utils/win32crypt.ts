let win32crypt: any = null

try {
    win32crypt = require('win32crypt')
} catch {}

type Scope = 'CurrentUser' | 'LocalMachine'

export function protectData(
    data: Uint8Array,
    entropy: Uint8Array | null,
    scope: Scope
): Uint8Array {
    return win32crypt?.protectData(data, entropy, scope) || data
}

export function unprotectData(
    data: Uint8Array,
    entropy: Uint8Array | null,
    scope: Scope
): Uint8Array {
    return win32crypt?.unprotectData(data, entropy, scope) || data
}
