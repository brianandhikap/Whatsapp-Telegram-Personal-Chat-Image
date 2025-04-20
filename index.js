const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const TelegramBot = require('node-telegram-bot-api');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

const telegramBot = new TelegramBot('TOKEN_BOT', { polling: true });
const telegramChatId = 'ID_Tele';

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code ready to scan!');
});

client.on('ready', () => {
    console.log('WhatsApp udah SIAP BOS KUH');
});

client.on('message', async message => {
    const sender = message.from;
    const media = message.hasMedia ? await message.downloadMedia() : null;

    if (sender === 'WA_Number@c.us' && message.hasMedia && media) {

        if (media.mimetype === 'image/webp') {
            console.log('skip');
        }
        else if (media.mimetype.startsWith('image')) {
            telegramBot.sendPhoto(telegramChatId, Buffer.from(media.data, 'base64'), { caption: 'Sender' });
        }
        else if (media.mimetype.startsWith('video')) {
            telegramBot.sendVideo(telegramChatId, Buffer.from(media.data, 'base64'), { caption: 'Sender' });
        }
    }
});

client.on('message_create', async message => {
    if (message.to === 'WA_Number@c.us' && message.hasMedia) {
        const media = await message.downloadMedia();

        if (media.mimetype === 'image/webp') {
            console.log('skip');
            //return;
        }
        else if (media.mimetype.startsWith('image')) {
            telegramBot.sendPhoto(telegramChatId, Buffer.from(media.data, 'base64'), { caption: 'You' });
        }
        else if (media.mimetype.startsWith('video')) {
            telegramBot.sendVideo(telegramChatId, Buffer.from(media.data, 'base64'), { caption: 'You' });
        }
    }
});

client.initialize();
