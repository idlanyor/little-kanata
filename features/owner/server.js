import os from 'os';

export async function systemSpec() {
    const platform = os.platform();
    const release = os.release();
    const osType = os.type();
    let OS = `OS: ${osType} (${platform} ${release})\n`

    // Informasi RAM
    const totalMem = os.totalmem() / (1024 ** 3); // Dalam GB
    const freeMem = os.freemem() / (1024 ** 3); // Dalam GB
    const usedMem = totalMem - freeMem;
    OS += `Total RAM: ${totalMem.toFixed(2)} GB \n`;
    OS += `RAM Terpakai: ${usedMem.toFixed(2)} GB \n`;
    OS += `RAM Tersedia: ${freeMem.toFixed(2)} GB \n`;

    // Informasi CPU
    const cpus = os.cpus();
    cpus.forEach((cpu, index) => {
        // console.log(`CPU ${index + 1}: ${cpu.model}, Kecepatan: ${cpu.speed} MHz /n`);
        OS += `CPU ${index + 1}: ${cpu.model} \n`;
    });
    return OS
}