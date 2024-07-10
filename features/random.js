import { lol } from "../helper/lolhuman.js";

export async function cerpen() {
    let response = await lol('cerpen')
    let { title, creator, cerpen } = response.data.result
    return `*CERITA PENDEK*\n
Judul : *_${title.trim()}_*\n
Pembuat : *${creator.trim()}*\n
${cerpen}
`

}
export async function quotes() {
    let response = await lol('random/quotes')
    let { by, quote } = response.data.result
    return ` *${quote}* - _${by}_`

}
