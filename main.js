import { clearMessages, wabe } from '@umamdev/wabe'
import { meta, tiktok, yutub } from './downloader.js';
import config from "./config.js";
import { groupParticipants, groupUpdate } from './group.js';
import { call } from './call.js';
import { bendera, caklontong, checkAnswer, gambar, jenaka, tebakSession } from './tebak/index.js';
import sticker from './features/sticker.js';
import { quotes, cerpen } from './features/random.js';
import { ytPlay } from './features/youtube.js';
import { removebg } from './features/image.js';
import { gemini, gemmaGroq, llamaGroq, mistral, mixtralGroq } from './ai.js';
import { helpMessage } from './helper/help.js';
import { gambarPdf } from './features/pdf.js';
// import { getLinkPreview } from 'link-preview-js';

const bot = new wabe({
    phoneNumber: config.notelp,
    sessionId: config.namaSesi,
    useStore: false
})


bot.start().then((sock) => {
    sock.ev.on('messages.upsert', async chatUpdate => {
        // console.log(chatUpdate.messages[0])
        try {
            let m = chatUpdate.messages[0];
            // make sticker
            await sticker(sock, m, chatUpdate);
            await removebg(sock, m, chatUpdate)
            await gambarPdf(sock, m, chatUpdate)

            if (!m.message) return;
            const chat = await clearMessages(m);

            let parsedMsg, sender, id, quotedMessageId;
            if (!chat) return;
            if (chat.chatsFrom === "private") {
                parsedMsg = chat.message
                sender = chat.pushName
                id = chat.remoteJid
                quotedMessageId = m;
            } else if (chat.chatsFrom === "group") {
                console.log(chat)
                parsedMsg = chat.participant.message
                sender = chat.participant.pushName
                id = chat.remoteJid
                quotedMessageId = m;
            }
            let pesan = parsedMsg.split(' ');
            const cmd = pesan[0].toLowerCase();
            pesan.shift();
            const psn = pesan.join(' ');
            let caption = ""
            if (tebakSession.has(id)) {
                if (m.key.fromMe) return
                await checkAnswer(id, parsedMsg.toLowerCase(), sock, quotedMessageId);
            } else {
                switch (cmd) {
                    case 'jenaka':
                        await jenaka(id, sock);
                        break;
                    case 'lontong':
                        await caklontong(id, sock);
                        break;
                    case 'gm':
                        if (psn === '') {
                            sock.sendMessage(id, { text: "Tanyakan sesuatu kepada Gemini" })
                            return
                        }
                        await sock.sendMessage(id, { text: await gemini(psn) });
                        break;
                    case 'mistral':
                        if (psn === '') {
                            sock.sendMessage(id, { text: "Tanyakan sesuatu kepada Mistral" })
                            return
                        }
                        await sock.sendMessage(id, { text: await mistral(psn) });
                        break;
                    case 'mixtral':
                        if (psn === '') {
                            sock.sendMessage(id, { text: "Tanyakan sesuatu kepada Mixtral" })
                            return
                        }
                        await sock.sendMessage(id, { text: await mixtralGroq(psn) });
                        break;
                    case 'llama':
                        if (psn === '') {
                            sock.sendMessage(id, { text: "Tanyakan sesuatu kepada Llama" })
                            return
                        }
                        await sock.sendMessage(id, { text: await llamaGroq(psn) });
                        break;
                    case 'gemma':
                        if (psn === '') {
                            sock.sendMessage(id, { text: "Tanyakan sesuatu kepada Gemma" })
                            return
                        }
                        await sock.sendMessage(id, { text: await gemmaGroq(psn) });
                        break;
                    case 's':
                        await jenaka(psn);
                        break;
                    case 'gambar':
                        await gambar(id, sock);
                        break;
                    case 'bendera':
                        await bendera(id, sock);
                        break;
                    case 'cerpen':
                        await sock.sendMessage(id, { text: await cerpen() });
                        break;
                    case 'yp':
                        try {
                            if (psn === '') {
                                sock.sendMessage(id, { text: "Masukan judul lagu yang akan diputar" })
                                return
                            }
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await ytPlay(psn)
                            caption += '_Preview gambarnya ga ada,xD_\n'
                            caption = '*Youtube Play Result*'
                            caption += '\nTitle :' + `*${result.title}*`
                            caption += '\nChannel :' + `*${result.channel}*`
                            caption += '\n _⏳Bentar yaa, audio lagi dikirim⏳_'
                            await sock.sendMessage(id, { text: caption })
                            // await sock.sendMessage(id, { text: result.audio })
                            await sock.sendMessage(id, { audio: { url: result.video } });
                        } catch (error) {
                            await sock.sendMessage(id, { text: 'ups,' + error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'yd':
                        try {
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await yutub(psn)
                            caption = '*Youtube Video Result*'
                            caption += '\nTitle :' + `*${result.title}*`
                            caption += '\nChannel :' + `*${result.channel}*`
                            await sock.sendMessage(id, { video: { url: result.video }, caption });
                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'ymd':
                        try {
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await yutub(psn);
                            // console.log(result.audio)
                            await sock.sendMessage(id, { audio: { url: result.video } });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'td':
                        try {
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await tiktok(psn);
                            // console.log(result.audio)
                            await sock.sendMessage(id, { video: { url: result.video }, caption: result.title });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'tmd':
                        try {
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await tiktok(psn);
                            // console.log(result.audio)
                            await sock.sendMessage(id, { audio: { url: result.audio } });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'igv':
                    case 'fd':
                    case 'meta':
                        try {
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await meta(psn);
                            // console.log(result.audio)
                            await sock.sendMessage(id, { video: { url: result } });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'help':
                        helpMessage(id,sock);
                        break;
                }
            }
        } catch (error) {
            console.log('_Ups, ada yang salah, silahkan coba beberapa saat lagi_', error)
            // sock.sendMessage()
        }
    })
    sock.ev.on('call', async (ev) => {
        call(ev, sock)
    });
    sock.ev.on('group-participants.update', async (ev) => {
        groupParticipants(ev, sock)
    });

    // Event listener for group updates
    sock.ev.on('groups.update', async (ev) => {
        groupUpdate(ev, sock);
    });
    // sock.ev.on('presence.update', (presence) => {
    //     console.log('Presence update event:', presence);
    //     // You can handle presence updates here, for example, logging user status changes
    //     console.log(`User: ${presence.id}, Status: ${presence.presences}`);

    // });
}).catch(error => console.log("Error starting Bot :", error))