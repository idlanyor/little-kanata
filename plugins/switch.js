import config from "../config.js";

export default async ({ sock, m, id, psn, sender, noTel, caption }) => {
    if (noTel.replace('@', '') !== config.ownerNumber) {
        await sock.sendMessage(id, { text: 'Kamu bukan owner bot' })
        return
    }
    await sock.sendMessage(id, { text: 'Bot berhasil ditukar' })
};
