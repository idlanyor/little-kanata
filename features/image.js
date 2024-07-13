// import { StickerTypes, createSticker } from "wa-sticker-formatter"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"
// import { lolPost } from "../helper/lolhuman.js"
import sharp from "sharp"
// import fs from 'node:fs';
import axios from 'axios';
import FormData from 'form-data';
import config from "../config.js";

async function removeBg(blob) {
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', blob);

    try {
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': config.removeBG
            },
            responseType: 'arraybuffer'
        });

        return response.data;
    } catch (error) {
        throw new Error(`${error.response.status}: ${error.response.statusText}`);
    }
}

export async function removebg(sock, m, chatUpdate) {
    if (chatUpdate.messages[0].message?.imageMessage?.caption == 'rem' && chatUpdate.messages[0].message?.imageMessage) {
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


        try {
            const resizedImage = await sharp(mediaData)
                .resize(800, 800, { // Change the dimensions as needed
                    fit: sharp.fit.inside,
                    withoutEnlargement: true
                })
                .toBuffer();


            let response = await removeBg(resizedImage)
            await sock.sendMessage(m.key.remoteJid, { image: response });
        } catch (error) {
            console.log('Error removing background:', error);
        }
    }
}