// jenaka.js
import { tebak } from '../helper/lolhuman.js';
import { maskSentence } from '../helper/word.js';

export let tebakSession = new Map();


export const jenaka = async (id, sock) => {
    try {
        const response = await tebak('jenaka');
        const question = response.data.result.question;
        const answer = response.data.result.answer;

        await sock.sendMessage(id, { text: question });

        tebakSession.set(id, {
            answer: answer,
            timeout: setTimeout(async () => {
                await sock.sendMessage(id, { text: `Waktu habis! Jawaban yang benar adalah: ${tebakSession.get(id).answer}` });
                tebakSession.delete(id);
            }, 60000) // 60 detik
        });
    } catch (error) {
        console.log(error)
        await sock.sendMessage(id, { text: 'Terjadi kesalahan, silakan coba lagi.' });
    }
};
export const caklontong = async (id, sock) => {
    try {
        const response = await tebak('caklontong');
        const question = response.data.result.question;
        const answer = response.data.result.answer;

        await sock.sendMessage(id, { text: question + ` ${maskSentence(answer)} (${answer.length}) kata` });

        tebakSession.set(id, {
            answer: answer,
            timeout: setTimeout(async () => {
                await sock.sendMessage(id, { text: `Waktu habis! Jawaban yang benar adalah: ${tebakSession.get(id).answer}` });
                tebakSession.delete(id);
            }, 60000) // 60 detik
        });
    } catch (error) {
        console.log(error)
        await sock.sendMessage(id, { text: 'Terjadi kesalahan, silakan coba lagi.' });
    }
};

export const bendera = async (id, sock) => {
    try {
        const response = await tebak('bendera');
        const question = response.data.result.flag;
        const answer = response.data.result.name;

        await sock.sendMessage(id, { text: question });

        tebakSession.set(id, {
            answer: answer,
            timeout: setTimeout(async () => {
                await sock.sendMessage(id, { text: `Waktu habis! Jawaban yang benar adalah: ${tebakSession.get(id).answer}` });
                tebakSession.delete(id);
            }, 60000) // 60 detik
        });
    } catch (error) {
        console.log(error)
        await sock.sendMessage(id, { text: 'Terjadi kesalahan, silakan coba lagi.' });
    }
};
export const gambar = async (id, sock) => {
    try {
        const response = await tebak('gambar');
        const img = response.data.result.image;
        const answer = response.data.result.answer;
        await sock.sendMessage(id, { image: { url: img.replace(/\.png$/, '.jpg') } })

        tebakSession.set(id, {
            answer: answer,
            timeout: setTimeout(async () => {
                await sock.sendMessage(id, { text: `Waktu habis! Jawaban yang benar adalah: ${tebakSession.get(id).answer}` });
                tebakSession.delete(id);
            }, 60000) // 60 detik
        });
    } catch (error) {
        console.log(error)
        await sock.sendMessage(id, { text: 'Terjadi kesalahan, silakan coba lagi.' });
    }
};

export const checkAnswer = async (id, userAnswer, sock, quotedMessageId) => {
    const correctAnswer = tebakSession.get(id).answer.toLowerCase();
    // console.log(correctAnswer)
    if (userAnswer === correctAnswer) {
        clearTimeout(tebakSession.get(id).timeout);
        await sock.sendMessage(id, {
            text: 'Jawaban kamu benar! ' + correctAnswer
        }, { quoted: quotedMessageId });
        tebakSession.delete(id);
    }
    //  else {
    //     await sock.sendMessage(id, {
    //         text: 'Jawaban salah, coba lagi!',
    //     }, { quoted: quotedMessageId });
    // }
};

