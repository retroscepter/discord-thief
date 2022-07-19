export function getDiscordPath() {
    if (process.platform === 'win32') {
        return `${process.env.APPDATA}/discord`
    }

    if (process.platform === 'darwin') {
        return `${process.env.HOME}/Library/Application Support/discord`
    }

    if (process.platform === 'linux') {
        return `${process.env.HOME}/.config/discord`
    }

    throw new Error(`Unsupport platform: ${process.platform}`)
}
