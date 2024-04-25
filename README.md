# Hardcore mode 😀
Fun, simple bot that forces language learners to step outside of their comfort zone... by NOT allowing them to speak in their native language.

## How it works
This bot is based off of the Discord.js library, and uses the Google Translate API to detect language.

Once you enable hardcore mode with the slash command `/hardcore`, the bot adds the `hardcore` role to the user.

Every message with this `hardcore` role will be analyzed to determine the language, if the message's language matches your native language role on the server, the bot will delete the message.

Users can disable harcore mode at any time with the same `/hardcore` command.

## Environment setup
This bot relies on keys from discord and from google.

In the root of the project, you must create a file called .env, with the following content for your accounts:

```env
DISCORD_TOKEN=<your discord token>
CLIENT_ID=<your discord client ID>
GOOGLE_PROJ_ID=<your google project ID>
GOOGLE_API_KEY=<your google API key>
```


## Local build steps
Now that we have the boring stuff out of the way, we can actually start up the bot.

Well, almost. We have a couple more things to do first.

This project is using the yarn package manager, if you do not have yarn installed, you can install it with

```cmd
npm install --global yarn
```

Before you can run the bot server, you need to install the dependencies, which you can do with

```cmd
yarn install
```

To run the bot, start 'er up with

```cmd
yarn dev
```

^ the above command is for development only. It includes hot reloading so you don't have to restart the server every time you make changes.

For production, please run

```cmd
yarn start
```

Happy not speaking in your native language!

## Limitations
1. Only handles spanish and english right now. Why? Because this bot what built for a spanish-english exhange discord server.
    (I plan to add wider language support)
2. Role names not easily customizable (I will fix this soon to make it a configuration option)

    Current role names are: "Spanish Native", "English Native", and "Hardcore"


