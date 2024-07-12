import { yutub } from "../downloader.js";
import { lol } from "../helper/lolhuman.js";

export const ytsearch = async (query) => {
    const response = (await lol('ytsearch', { params: { query } })).data.result
        .map(({ videoId, thumbnail, title }) => ({
            url: "https://www.youtube.com/watch?v=" + videoId,
            thumbnail,
            title
        }));
    return response;
}

export const ytvid = async (url) => {
    const response = (await lol('ytvideo', { params: { url } })).data.result;
    return response;
}
export const ytaud = async (url) => {
    const response = (await lol('ytvideo', { params: { url } })).data.result;
    return response;
}

export const ytPlay = async (query) => {
    try {
        const { url } = (await ytsearch(query))[0];
        return yutub(url);
    } catch (error) {
        console.error('Error in ytPlay2:', error);
        return error;
    }
}

// console.log(await ytPlay('jejak awan pesawat'))

// const testPerformance = async () => {
//     const query = 'jejak awan pesawat official';

//     // Mengukur waktu eksekusi untuk ytPlay
//     console.time('ytPlay');
//     await ytPlay(query);
//     console.timeEnd('ytPlay');

//     // Mengukur waktu eksekusi untuk ytPlay2
//     console.time('ytPlay2');
//     await ytPlay2(query);
//     console.timeEnd('ytPlay2');

//     // Menentukan mana yang lebih cepat
//     const timeTaken1 = console.timeLog('ytPlay');
//     const timeTaken2 = console.timeLog('ytPlay2');

//     if (timeTaken1 < timeTaken2) {
//         console.log('ytPlay lebih cepat.');
//     } else if (timeTaken1 > timeTaken2) {
//         console.log('ytPlay2 lebih cepat.');
//     } else {
//         console.log('Kedua fungsi memiliki waktu eksekusi yang sama.');
//     }
// };

// // Jalankan pengujian
// testPerformance();
