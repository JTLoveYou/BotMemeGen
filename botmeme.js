const { Client, Intents, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const openai = require('openai');
const fs = require('fs');
const path = require('path');


const DISCORD_TOKEN = 'VOTRE_TOKEN_DISCORD';


openai.apiKey = 'VOTRE_CLE_OPENAI';


const bannedWords = ["penis", "vagina", "sex", "nude", "boobs", "dick", "fuck", "porn", "ass", "pussy"];


const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);


const commands = [
    new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche la liste des commandes disponibles.'),
    new SlashCommandBuilder()
        .setName('c')
        .setDescription('Générer un meme avec une légende IA.')
        .addStringOption(option => 
            option.setName('prompt')
            .setDescription('Le sujet du meme')
            .setRequired(true))
];

(async () => {
    try {
        console.log('Enregistrement des commandes slash.');
        await rest.put(
            Routes.applicationCommands('VOTRE_CLIENT_ID'),
            { body: commands },
        );
        console.log('Commandes enregistrées avec succès.');
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

function containsBannedWords(text, nsfwChannel) {
    if (nsfwChannel) return false;  
    const lowerText = text.toLowerCase();
    return bannedWords.some(word => lowerText.includes(word));
}


async function generateCaption(prompt) {
    const response = await openai.Completion.create({
        engine: "text-davinci-003",
        prompt: prompt,
        max_tokens: 60,
        temperature: 0.8,
    });
    return response.choices[0].text.trim();
}


async function createMeme(templatePath, caption) {
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext('2d');
    
    const image = await loadImage(templatePath);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(caption, 10, 50);
    
    return canvas.toBuffer();
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        await interaction.reply({
            content: "Commandes disponibles :\n" +
                     "/help - Affiche cette liste de commandes.\n" +
                     "/c [prompt] - Génère un meme basé sur le prompt fourni.",
            ephemeral: true
        });
    } else if (commandName === 'c') {
        const prompt = interaction.options.getString('prompt');
        const nsfwChannel = interaction.channel.nsfw;

        if (containsBannedWords(prompt, nsfwChannel)) {
            await interaction.reply({
                content: "Votre prompt contient des mots interdits dans ce salon.",
                ephemeral: true
            });
            return;
        }

        let modifiedPrompt = nsfwChannel 
            ? `NSFW meme caption: ${prompt}` 
            : `Safe for work meme caption: ${prompt}`;

        await interaction.deferReply();
        
       
        const caption = await generateCaption(modifiedPrompt);
        
        
        const memeImage = await createMeme(path.join(__dirname, 'template.png'), caption);
        
        
        const attachment = {
            files: [{ attachment: memeImage, name: 'meme.png' }]
        };
        await interaction.followUp(attachment);
    }
});


client.login(DISCORD_TOKEN);
