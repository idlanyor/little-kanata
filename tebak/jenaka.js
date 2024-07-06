// jenaka.js
import axios from 'axios';

let tebakSession = new Map();

const jenaka = async (id, sock) => {
    try {
        const response = await axios.get('https://api.lolhuman.xyz/api/tebak/jenaka?apikey=yatanokagami');
        const question = response.data.result.question;
        const answer = response.data.result.answer;

        await sock.sendMessage(id, { text: question });

        tebakSession.set(id, {
            answer: answer,
            timeout: setTimeout(async () => {
                await sock.sendMessage(id, { text: `Waktu habis! Jawaban yang benar adalah: ${tebakSession.get(id).answer}` });
                tebakSession.delete(id);
            }, 20000) // 20 detik
        });
    } catch (error) {
        await sock.sendMessage(id, { text: 'Terjadi kesalahan, silakan coba lagi.' });
    }
};

const checkAnswer = async (id, userAnswer, sock, quotedMessageId) => {
    const correctAnswer = tebakSession.get(id).answer.toLowerCase();
    if (userAnswer === correctAnswer) {
        clearTimeout(tebakSession.get(id).timeout);
        await sock.sendMessage(id, {
            text: 'Jawaban kamu benar! ' + correctAnswer
        }, { quoted: quotedMessageId });
        tebakSession.delete(id);
    } else {
        await sock.sendMessage(id, {
            text: 'Jawaban salah, coba lagi!',
        }, { quoted: quotedMessageId });
    }
};

export { jenaka, checkAnswer, tebakSession };
