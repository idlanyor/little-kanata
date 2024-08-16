import { vcard } from "../features/owner/ownerContact.js"

export default async ({ sock, m, id, psn, sender, noTel, caption }) => {
    await sock.sendMessage(
        id,
        {
            contacts: {
                displayName: 'Roy',
                contacts: [{ vcard }]
            }
        }
    )
}