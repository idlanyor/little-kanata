import { JSONFilePreset } from 'lowdb/node';

const defaultData = {
    users: []
}
const db = await JSONFilePreset('db.json', defaultData)

export const registerUser = async ({ id, userName, isPrem, points, credit }) => {
    const user = { id, userName, isPrem, points, credit };
    await db.update(({ users }) => {
        const existingUser = users.find(u => u.id === id);
        if (existingUser) {
            existingUser.userName = userName;
            existingUser.isPrem = isPrem;
            existingUser.points = points;
            existingUser.credit = credit;
        } else {
            users.push(user);
        }
    });
    return db.write()
}

