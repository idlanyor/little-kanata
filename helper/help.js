import config from "../config.js";
import { quotes } from "../features/random.js";
export async function helpMessage(id, sock) {

let caption = `
*Kanata Bot*
_by Idlanyor_\n\n
Here My Command List

*ARTIFICIAL INTELLIGENCE*
> gm - Chat With Gemini AI
> mistral - Chat With Mistral AI
> mixtral - Chat With Mixtral AI
> llama - Chat With Llama AI
> gemma - Chat With Gemma AI
*DOWNLOADER*
> td - Tiktok Downloader by Url
> tmd - Tiktok Audio downloader by Url
> igv - Instagram Video Downloader by Url
> igp - Instagram Picture Downloader by Url
> yd - Download Youtube video by url
> ymd - Download Youtube music by url\n
*GENERAL*
> s - Stiker(send image with caption 's')
*RANDOM*
> cerpen - Random cerpen from creative author
*MINIGAME*
> gambar - tebak gambar
> bendera - tebak bendera
> jenaka - tebak kata jenaka
> lontong - teka teki sulit


${await quotes()}`
    await sock.sendMessage(id, { image: { url: 'https://api.lolhuman.xyz/api/random2/waifu?apikey=' + config.apikey }, caption });
}