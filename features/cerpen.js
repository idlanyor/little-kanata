import { lol } from "../helper/lolhuman.js";

export default async function cerpen() {
    let response = await lol('cerpen')
    let { title, creator, cerpen } = response.data.result
    return `*CERITA PENDEK*\n
Judul : *_${title.trim()}_*\n
Pembuat : *${creator.trim()}*\n
${cerpen}
`

}
console.log(await cerpen())