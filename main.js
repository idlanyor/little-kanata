import { clearMessages, wabe } from '@umamdev/wabe'
import ai from './command.js'
import config from "./config.js";

const bot = new wabe({
    phoneNumber: config.notelp,
    sessionId: config.namaSesi,
    useStore: false
})

bot.start().then((sock) => {
    sock.ev.on('messages.upsert', async chatUpdate => {
        try {
            let m = chatUpdate.messages[0];
            if (!m.message) return;
            const msg = await clearMessages(m);
            let parsedMsg, sender, id
            if (!msg) return;
            if (msg.chatsFrom === "private") {
                parsedMsg = msg.message
                sender = msg.pushName
                id = msg.remoteJid
            } else if (msg.chatsFrom === "group") {
                parsedMsg = msg.participant.message
                sender = msg.participant.pushName
                id = msg.remoteJid
            }
            console.log(parsedMsg)
            console.log(sender)
            console.log(id)
            let pesan = parsedMsg.split(' ');
            const cmd = pesan[0];
            pesan.shift();
            const psn = pesan.join(' ');
            if (cmd === 'gemini') {
                if (psn == undefined) {
                    await sock.sendMessage(id);
                }
                sock.sendMessage(id, { text: await ai.geminiText(psn) })
            } else if (cmd === 'gpt') {
                await sock.sendMessage(id, { text: await ai.gptText(psn, sender) })
            } else if (cmd == 'help') {
                await sock.sendMessage(id, {
                    text: `Hai ${sender},Berikut adalah daftar perintah yang tersedia:
> - \`.gemini\`: Untuk berinteraksi dengan Gemini AI.
> - \`.gpt\`: Untuk berinteraksi dengan GPT-3.
> - \`.help\`: Untuk menampilkan pesan bantuan ini.

Terima kasih!` })
            }
        } catch (error) {
            console.log(error)
            sock.sendMessage('_Ups,ada yang salah,silahkan coba beberapa saat lagi_')
        }
    })
}).catch(error => console.log("Error starting Bot :", error))