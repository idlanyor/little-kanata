import { StickerTypes, createSticker } from "wa-sticker-formatter"
import { downloadContentFromMessage } from "@whiskeysockets/baileys"

export default async function sticker(sock,m,chatUpdate) {
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
            await sock.sendMessage(m.key.remoteJid, { sticker: generateSticker })
        } catch (error) {
            console.log('Error creating sticker:', error);
        }
    }
}