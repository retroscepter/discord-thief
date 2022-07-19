export const ENCRYPTED_REGEX = [/(dQw4w9WgXcQ:)([^.*['(.*)'\].*$][^"]*)/]

export const UNENCRYPTED_REGEX = [
    /[\w-]{24}\.[\w-]{6}\.[\w\-_]+/,
    /mfa\.[\w-]{84}/
]
