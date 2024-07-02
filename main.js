import { clearMessages, wabe } from '@umamdev/wabe'
import ai from './ai.js'
import { meta, tiktok } from './downloader.js';
import config from "./config.js";
import { groupParticipants, groupUpdate } from './group.js';
import { call } from './call.js';
// import { getLinkPreview } from 'link-preview-js';

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
            // console.log(id)
            console.log(sender)
            console.log(parsedMsg)
            let pesan = parsedMsg.split(' ');
            const cmd = pesan[0];
            pesan.shift();
            const psn = pesan.join(' ');
            switch (cmd) {
               
                case 'tad':
                    try {
                        let result = await tiktok(psn)
                        console.log(result.audio)
                        sock.sendMessage(id, { text: 'Processing,please wait...' });
                        await sock.sendMessage(id, { audio: { url: result.audio } });

                    } catch (error) {
                        await sock.sendMessage(id, { text: error.message });

                    }
                    break;
                case 'igv':
                case 'fd':
                case 'meta':
                    try {
                        let result = await meta(psn)
                        // console.log(result.audio)
                        sock.sendMessage(id, { text: 'Processing,please wait...' });
                        await sock.sendMessage(id, { video: { url: result } });

                    } catch (error) {
                        await sock.sendMessage(id, { text: error.message });

                    }
                    break;
                case 'help':
                    await sock.sendMessage(id, {
                        text: `Hai ${sender},Berikut adalah daftar perintah yang tersedia:
> - \`.gemini\`: Untuk berinteraksi dengan Gemini AI.
> - \`.gpt\`: Untuk berinteraksi dengan GPT-3.
> - \`.help\`: Untuk menampilkan pesan bantuan ini.

Terima kasih!`
                    });
                    break;
            }
        } catch (error) {
            console.log(error)
            sock.sendMessage('_Ups,ada yang salah,silahkan coba beberapa saat lagi_')
        }
    })
    sock.ev.on('call', async (ev) => {
        call(ev)
    });
    sock.ev.on('group-participants.update', async (ev) => {
        groupParticipants(ev)
    });

    // Event listener for group updates
    sock.ev.on('groups.update', async (ev) => {
        groupUpdate(ev);
    });
    // sock.ev.on('presence.update', (presence) => {
    //     console.log('Presence update event:', presence);
    //     // You can handle presence updates here, for example, logging user status changes
    //     console.log(`User: ${presence.id}, Status: ${presence.presences}`);

    // });
}).catch(error => console.log("Error starting Bot :", error))