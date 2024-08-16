import moment from 'moment';
export let tebakSession = new Map();
export const checkAnswer = async (id, userAnswer, sock, quotedMessageId) => {
    const session = tebakSession.get(id);
    const correctAnswer = session.answer.toLowerCase();
    const questionTime = session.timestamp; // Waktu pertanyaan diajukan
    const currentTime = moment(); // Waktu saat ini

    const timeElapsed = currentTime.diff(questionTime, 'seconds'); // Menghitung selisih waktu dalam detik

    let maxPoin;
    let minPoin;

    if (timeElapsed <= 10) {
        minPoin = 900;
        maxPoin = 1000;
    } else if (timeElapsed <= 30) {
        minPoin = 800;
        maxPoin = 900;
    } else if (timeElapsed <= 60) {
        minPoin = 700;
        maxPoin = 800;
    } else if (timeElapsed <= 120) {
        minPoin = 600;
        maxPoin = 700;
    } else if (timeElapsed <= 180) {
        minPoin = 500;
        maxPoin = 600;
    } else if (timeElapsed <= 240) {
        minPoin = 400;
        maxPoin = 500;
    } else if (timeElapsed <= 300) {
        minPoin = 300;
        maxPoin = 400;
    } else if (timeElapsed <= 360) {
        minPoin = 200;
        maxPoin = 300;
    } else if (timeElapsed <= 420) {
        minPoin = 100;
        maxPoin = 200;
    } else {
        minPoin = 50;
        maxPoin = 100;
    }

    const kalkulasiPoin = Math.floor(Math.random() * (maxPoin - minPoin + 1)) + minPoin;

    if (userAnswer.toLowerCase() === correctAnswer) {
        clearTimeout(session.timeout);
        await sock.sendMessage(id, {
            text: 'Jawaban kamu benar! ' + correctAnswer + `\nSelamat poin kamu bertambah ${kalkulasiPoin} pts`,
        }, { quoted: quotedMessageId });
        tebakSession.delete(id);
    }

    // else {
    //     await sock.sendMessage(id, {
    //         text: 'Jawaban kamu salah. Coba lagi!',
    //     }, { quoted: quotedMessageId });
    // }
};


