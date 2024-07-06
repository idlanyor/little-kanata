import { clearMessages, wabe } from '@umamdev/wabe'
// import ai from './ai.js'
import { meta, tiktok, yutub } from './downloader.js';
import config from "./config.js";
import { groupParticipants, groupUpdate } from './group.js';
import { call } from './call.js';
import { bendera, checkAnswer, gambar, jenaka, tebakSession } from './tebak/index.js';
import sticker from './features/sticker.js';
import cerpen from './features/cerpen.js';
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

            if (!m.message || m.key.fromMe) return;
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
            const cmd = pesan[0];
            pesan.shift();
            const psn = pesan.join(' ');
            if (tebakSession.has(id)) {
                await checkAnswer(id, parsedMsg.toLowerCase(), sock, quotedMessageId);
            } else {
                switch (cmd) {
                    case 'jenaka':
                        await jenaka(id, sock);
                        break;
                    case 'gambar':
                        await gambar(id, sock);
                        break;
                    case 'bendera':
                        await bendera(id, sock);
                        break;
                    case 'bendera':
                        await bendera(id, sock);
                        break;
                    case 'cerpen':
                        await sock.sendMessage(id, { text: await cerpen() });
                        break;
                    case 'yd':
                        try {
                            sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await yutub(psn)
                            let caption = '*Youtube Video Result*'
                            caption += '\nTitle :' + `*${result.title}*`
                            caption += '\nSize :' + `*${result.size}*`
                            caption += '\nChannel :' + `*${result.channel}*`
                            await sock.sendMessage(id, { video: { url: result.video }, caption });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'ymd':
                        try {
                            let result = await yutub(psn);
                            // console.log(result.audio)
                            sock.sendMessage(id, { text: 'Processing, please wait...' });
                            await sock.sendMessage(id, { audio: { url: result.video } });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'td':
                        try {
                            let result = await tiktok(psn);
                            // console.log(result.audio)
                            sock.sendMessage(id, { text: 'Processing, please wait...' });
                            await sock.sendMessage(id, { video: { url: result.video }, caption: result.title });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'tmd':
                        try {
                            let result = await tiktok(psn);
                            // console.log(result.audio)
                            sock.sendMessage(id, { text: 'Processing, please wait...' });
                            await sock.sendMessage(id, { audio: { url: result.audio } });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'igv':
                    case 'fd':
                    case 'meta':
                        try {
                            let result = await meta(psn);
                            // console.log(result.audio)
                            sock.sendMessage(id, { text: 'Processing, please wait...' });
                            await sock.sendMessage(id, { video: { url: result } });

                        } catch (error) {
                            await sock.sendMessage(id, { text: error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'help':
                        await sock.sendMessage(id, {
                            text: `*Kanata Bot*
_by Idlanyor_\n\n
Here My Command List
*Downloader*
> td - Tiktok Downloader by Url
> tmd - Tiktok Audio downloader by Url
> igv - Instagram Video Downloader by Url
> igp - Instagram Picture Downloader by Url
> yd - Download Youtube video by url
> ymd - Download Youtube music by url

Thank You!`
                        });
                        break; // Tambahkan break di sini
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