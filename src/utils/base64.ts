export function b64Encode(input: string) {
    return Buffer.from(input).toString('base64')
}

export function b64Decode(input: string) {
    return Buffer.from(input, 'base64').toString('ascii')
}
