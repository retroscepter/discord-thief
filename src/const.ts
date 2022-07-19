export const ENCRYPTED_REGEX = [
    new RegExp("(dQw4w9WgXcQ:)([^.*\\['(.*)'\\].*$][^\"]*)")
]

export const UNENCRYPTED_REGEX = [
    new RegExp('[\\w-]{24}\\.[\\w-]{6}\\.[\\w-]{27}'),
    new RegExp('mfa\\.[\\w-]{84}')
]
