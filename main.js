import fs from 'fs'
import { clearMessages, wabe } from '@umamdev/wabe'
import { meta, tiktok, yutub } from './downloader.js';
import config from "./config.js";
import { groupParticipants, groupUpdate, grupAction } from './group.js';
import { call } from './call.js';
import { bendera, caklontong, checkAnswer, gambar, jenaka, susun, tebakSession } from './tebak/index.js';
import sticker from './features/sticker.js';
import { cerpen } from './features/random.js';
import { ytPlay, ytSearchResult } from './features/youtube.js';
import { removebg } from './features/image.js';
import { gemini, gemmaGroq, llamaGroq, mistral, mixtralGroq } from './ai.js';
import { helpMessage } from './helper/help.js';
import { gambarPdf } from './features/pdf.js';
import { tomp3 } from './features/converter.js';
import { calculatePing, systemSpec } from './features/owner/server.js';
import { chatgpt4 } from './features/rapidai.js';
import { vcard } from './features/owner/ownerContact.js';
import { registerUser } from './helper/database.js';
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
            // make sticker
            await sticker(sock, m, chatUpdate);
            await removebg(sock, m, chatUpdate)
            await gambarPdf(sock, m, chatUpdate)
            await tomp3(sock, m, chatUpdate)

            if (!m.message) return;
            const chat = await clearMessages(m);

            let parsedMsg, sender, id, quotedMessageId, noTel;
            if (!chat) return;
            if (chat.chatsFrom === "private") {
                parsedMsg = chat.message
                sender = chat.pushName || chat.remoteJid
                id = chat.remoteJid
                noTel = chat.remoteJid
                quotedMessageId = m;
            } else if (chat.chatsFrom === "group") {
                console.log(chat)
                parsedMsg = chat.participant.message
                noTel = chat.participant.number
                sender = chat.participant.pushName || chat.participant.number
                id = chat.remoteJid
                quotedMessageId = m;
            }
            let pesan = parsedMsg.split(' ');
            const cmd = pesan[0].toLowerCase();
            pesan.shift();
            const psn = pesan.join(' ');
            noTel = '@' + noTel.replace('@s.whatsapp.net', '');
            let caption = ""
            if (tebakSession.has(id)) {
                if (m.key.fromMe) return
                await checkAnswer(id, parsedMsg.toLowerCase(), sock, quotedMessageId);
            } else {
                switch (cmd) {
                    case 'h':
                    case 'help':
                    case 'menu':
                        await sock.sendMessage(id, {
                            text: await helpMessage(sender, noTel),
                            footer: 'Lorem Ipsum',
                            contextInfo: {
                                forwardingScore: 100,
                                isForwarded: false,
                                mentionedJid: [id],
                                forwardedNewsletterMessageInfo: {
                                    newsletterName: 'KanataBot',
                                    newsletterJid: m.key.remoteJid
                                },
                                externalAdReply: {
                                    showAdAttribution: true,
                                    title: 'KanataBot',
                                    body: '@roidev',
                                    thumbnailUrl: 'https://i.ebayimg.com/images/g/6wgAAOSwvTpkT51M/s-l1600.webp',
                                    sourceUrl: 'https://chat.whatsapp.com/DvrnHEz7CZa4aWlzQd7B07',
                                    // sourceUrl: 'https://whatsapp.com/channel/0029Va4K0PZ5a245NkngBA2M',
                                    mediaType: 3,
                                    renderLargerThumbnail: false
                                },
                            },
                        })
                        break;
                    // Registrasi user
                    case 'reg':

                        console.log(noTel)
                        if (psn === '') {
                            sock.sendMessage(id, { text: "ketik *reg<spasi>namaKamu*,contoh `reg Roynaldi`" })
                            return
                        }
                        // let idUser = id
                        await registerUser({ id: noTel, userName: psn, isPrem: false, points: 0, credit: 10 })
                        await sock.sendMessage(id, { text: `「 *REGISTRASI BERHASIL* 」\n🗝️ID: ${noTel.replace('@', '')}\n📝 NAMA: ${psn.toUpperCase()}\n✨ STATUS:Not Premium\n💯 POIN:0\n💸 CREDIT:10` })
                        break
                    // Game
                    case 'owner':
                        await sock.sendMessage(
                            id,
                            {
                                contacts: {
                                    displayName: 'Roy',
                                    contacts: [{ vcard }]
                                }
                            }
                        )
                        break;
                    case 'susun':
                        await susun(id, sock);
                        break;
                    case 'switch':
                        if (noTel.replace('@', '') !== config.ownerNumber) {
                            await sock.sendMessage(id, { text: 'Kamu bukan owner bot' })
                            return
                        }
                        await sock.sendMessage(id, { text: 'Bot berhasil ditukar' })
                        break;
                    case 'jenaka':
                        await jenaka(id, sock);
                        break;
                    case 'lontong':
                        await caklontong(id, sock);
                        break;
                    case 'gambar':
                        await gambar(id, sock);
                        break;
                    case 'bendera':
                        await bendera(id, sock);
                        break;
                    case 'ping':
                        await sock.sendMessage(id, { text: `Bot merespon dalam *_${calculatePing(m.messageTimestamp, Date.now())} detik_*` })
                        break;
                    case 'stats':
                        await sock.sendMessage(id, { text: `${await systemSpec()}` })
                        break;
                    case 'yts':
                        await sock.sendMessage(id, { text: `${await ytSearchResult(psn)}` })
                        break;
                    // Downloader
                    case 'yp':
                        try {
                            if (psn === '') {
                                sock.sendMessage(id, { text: "Masukan judul lagu yang akan diputar" })
                                return
                            }
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await ytPlay(psn)
                            caption = '*Youtube Play Result*'
                            // caption += '_Preview gambarnya ga ada,xD_\n'
                            caption += '\nTitle :' + `*${result.title}*`
                            caption += '\nChannel :' + `*${result.channel}*`
                            caption += '\n _⏳Bentar yaa, audio lagi dikirim⏳_'

                            await sock.sendMessage(id, { image: result.thumbnail })
                            // await sock.sendMessage(id, { text: result.audio })
                            await sock.sendMessage(id, { audio: { url: result.audio }, ptt: true });
                        } catch (error) {
                            await sock.sendMessage(id, { text: 'ups,' + error.message });
                        }
                        break; // Tambahkan break di sini
                    case 'ypv':
                        try {
                            if (psn === '') {
                                sock.sendMessage(id, { text: "Masukan judul video yang akan diputar" })
                                return
                            }
                            await sock.sendMessage(id, { text: 'Processing, please wait...' });
                            let result = await ytPlay(psn)
                            caption = '*Youtube Play Result*'
                            caption += '\nTitle :' + `*${result.title}*`
                            caption += '\nChannel :' + `*${result.channel}*`
                            caption += '\n _⏳Bentar yaa, audio lagi dikirim⏳_'

                            // await sock.sendMessage(id, { text: caption })
                            // await sock.sendMessage(id, { text: result.audio })
                            await sock.sendMessage(id, { video: { url: result.video }, caption });
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
                            await sock.sendMessage(id, { audio: { url: result.audio }, ptt: true });

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
                        break;
                    // Artificial Intelligence
                    case 'gm':
                        if (psn === '') {
                            sock.sendMessage(id, { text: "Tanyakan sesuatu kepada Gemini" })
                            return
                        }
                        await sock.sendMessage(id, { text: await gemini(psn) });
                        break;
                    case 'test':
                        await sock.sendMessage(id, { text: "Bot tester on\n\n" + await systemSpec() })
                        break;
                    case 'gpt4':
                        if (psn === '') {
                            await sock.sendMessage(id, { text: "Tanyakan sesuatu kepada GPT-4" })
                            return
                        }
                        await sock.sendMessage(id, { text: `_pertanyaan (${psn}) telah diterima dan sedang diproses_` })
                        await sock.sendMessage(id, { text: await chatgpt4(psn) });
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
                    case 'cerpen':
                        await sock.sendMessage(id, { text: await cerpen() });
                        break;
                    case 'promote':
                        await grupAction.promote(id, psn, sock)
                        break;
                    case 'demote':
                        await grupAction.demote(id, psn, sock)
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