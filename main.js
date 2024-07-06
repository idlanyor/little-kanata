import { clearMessages, wabe } from '@umamdev/wabe'
// import ai from './ai.js'
import { createSticker, StickerTypes } from 'wa-sticker-formatter';
import { meta, tiktok, yutub } from './downloader.js';
import config from "./config.js";
import { groupParticipants, groupUpdate } from './group.js';
import { call } from './call.js';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import axios from 'axios';
import { checkAnswer, jenaka, tebakSession } from './tebak/jenaka.js';
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

            // make stiker 
            if (chatUpdate.messages[0].message?.imageMessage?.caption == 's' && chatUpdate.messages[0].message?.imageMessage) {
                // console.log(true)
                const getMedia = async (msg) => {
                    console.log(msg)
                    const messageType = Object.keys(msg?.message)[0]
                    const stream = await downloadContentFromMessage(msg.message[messageType], messageType.replace('Message', ''))
                    let buffer = Buffer.from([])
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk])
                    }

                    return buffer
                }

                const mediaData = await getMedia(m)
                if (!mediaData) {
                    console.log('Media data not found');
                    return;
                }

                const stickerOption = {
                    pack: "Kanata",
                    author: "KanataBot",
                    type: StickerTypes.FULL,
                    quality: 100
                }

                try {
                    const generateSticker = await createSticker(mediaData, stickerOption);
                    await sock.sendMessage(m.key.remoteJid, { sticker: generateSticker }) //langsung cobaaa
                } catch (error) {
                    console.log('Error creating sticker:', error);
                }
            }
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
                    // case 'coba':
                    //     if (m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) {
                    //         const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
                    //         if (quotedMessage) {
                    //             console.log('Quoted message:', quotedMessage);

                    //             // Ambil teks dari pesan yang dikutip (jika tersedia)
                    //             const quotedText = quotedMessage.conversation || quotedMessage.extendedTextMessage?.text;
                    //             console.log('Quoted text:', quotedText);


                    //         }
                    //     }
                    //     break;
                    case 'jenaka':
                        await jenaka(id, sock);
                        break;
                    case 'yd':
                        try {
                            sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await yutub(psn)
                            // console.log(result.audio)
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
                            await sock.sendMessage(id, { audio: { url: result.audio } });

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