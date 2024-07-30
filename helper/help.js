import { quotes } from "../features/random.js";
export async function helpMessage(sender) {

    let caption = `
*Kanata Bot*
_by Idlanyor_\n\n

Hai *${sender}*
Here My Command List

❏┄┅━┅┄〈 〘 Artificial Intelligence 〙
> gm - Chat With Gemini AI
> mistral - Chat With Mistral AI
> mixtral - Chat With Mixtral AI
> llama - Chat With Llama AI
> gemma - Chat With Gemma AI

❏┄┅━┅┄〈 〘 Downloader 〙
> td - Tiktok Downloader by Url
> tmd - Tiktok Audio downloader by Url
> igv - Instagram Video Downloader by Url
> igp - Instagram Picture Downloader by Url
> yd - Download Youtube video by url
> yp - Play Youtube audio by query
> yv - Play Youtube video by query
> ymd - Download Youtube music by url\n

❏┄┅━┅┄〈 〘 General 〙
> s - Stiker(send image with caption 's')
> rem - remove background from image

❏┄┅━┅┄〈 〘 Random 〙
> cerpen - Random cerpen from creative author
> kisahnabi <nama nabi> - Random 25 kisah nabi

❏┄┅━┅┄〈 〘 Mini Game 〙
> gambar - tebak gambar
> bendera - tebak bendera
> jenaka - tebak kata jenaka
> lontong - teka teki sulit

❏┄┅━┅┄〈 〘 Misc. 〙
> owner - nampilin nomor owner bot
> ping - buat ngecek kecepatan respons bot
> jenaka - tebak kata jenaka
> lontong - teka teki sulit


${await quotes()}`

    return caption
}