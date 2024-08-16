import { llamaGroq } from "../ai.js";

export default async ({ sock, m, id, psn, sender, noTel, caption }) => {
    if (psn === '') {
        sock.sendMessage(id, { text: "Tanyakan sesuatu kepada Llama" })
        return
    }
    await sock.sendMessage(id, { text: await llamaGroq(psn) });
};
