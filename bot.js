if (!process.env.prod) { import("dotenv/config") }
    
import { REST, Routes } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

const constants = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    GOOGLE_PROJ_ID: process.env.GOOGLE_PROJ_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY   
}

const rest = new REST({ version: '10' }).setToken(constants.DISCORD_TOKEN)

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.MessageContent
]});

const translate = new Translate({
    projectId: constants.GOOGLE_PROJ_ID, 
    key: constants.GOOGLE_API_KEY
});

const LANG_ROLE_MAP = {
    "English Native": "en",
    "Spanish Native": "es"
}

const COMMANDS = [
    {
      name: 'hardcore',
      description: 'Toggles hardcore mode!',
    },
  ];

const refreshCommands = async(commands) => {
    console.log('Started refreshing application (/) commands.');
      
    await rest.put(
        Routes.applicationCommands(constants.CLIENT_ID), 
        { body: commands }
    );
  
    console.log('Successfully reloaded application (/) commands.');
}

const checkRoles = (member, roleName) => {
    return member.roles.cache.some(role => role.name === roleName)
}

const handleMessages = async(message) => {
    const USER_ID = message.author.id
    const USER_NAME = message.author.username
    const IS_BOT = message.author.bot
    const isHardcore = checkRoles(message.member, "Hardcore")

    console.log(`user #${USER_ID} (${USER_NAME}) sent message #${message.id}`)

    if(IS_BOT){
        console.log(`bot #${USER_ID} (${USER_NAME}) ignored`)
        return
    } else if (isHardcore) {
        const detectionResults = await detectLanguage(message.content)
        const language = detectionResults.language

        console.log(`message #${message.id} detected as \"${language}\" with ${detectionResults.confidence * 100}% confidence`)

        if(message.member.roles.cache.some(role => LANG_ROLE_MAP[role.name] === language)){
            message.delete()
            console.log(`message #${message.id} deleted for hardcore mode violation`)
        }
    } else {
        console.info(`user #${USER_ID} (${USER_NAME}) does not have hardcore mode activated`)
        return
    }
}

const handleInteractions = async(interaction) => {
    if (!interaction.isChatInputCommand()) return;
      
    console.log(checkRoles(interaction.member, "Hardcore"))

    if (interaction.commandName === 'hardcore') {
        if(checkRoles(interaction.member, "Hardcore")){
            await interaction.member.roles.remove("1232715390539403375")
            await interaction.reply("hardcore has been removed!")
            console.log(`hardcore role removed from user #${interaction.member.id}`)
        } else {
            await interaction.member.roles.add("1232715390539403375") 
            await interaction.reply("hardcore has been added!")
            console.log(`hardcore role added to user #${interaction.member.id}`)
        }
    }
}

const main = async() => {
    try {
        refreshCommands(COMMANDS)
    
        client.on('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });
        
        client.on('messageCreate', handleMessages)
        client.on('interactionCreate', handleInteractions);
        
        client.login(constants.DISCORD_TOKEN);
    } catch (e) {
        console.log(e)
    }
}

main()