// import fs from 'node:fs';
// import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
// import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile.js';
// import config from '../config.js';
// import { telegraph } from './uploader.js';

// class ApiLove {
//     constructor(opt = undefined) {
//         this.apilove = new ILovePDFApi(config.pdf.public, config.pdf.secret, {
//             url: 'https://api.ilovepdf.com'  // Menentukan base URL secara eksplisit
//         });

//     }

//     async imgToPdf(imgBuffer) {
//         try {
//             // const imgUrl = await telegraph(imgBuffer);
//             const file = new ILovePDFFile(imgBuffer)
//             const task = this.apilove.newTask('imagepdf');
//             await task.addFile(file);
//             await task.process();
//             return task.download();
//         } catch (error) {
//             console.error('Gagal mengkonversi gambar ke PDF:', error);
//             throw error;
//         }
//     }
// }

// (async () => {
//     try {
//         const apilove = new ApiLove();
//         const pdfBuffer = await apilove.imgToPdf('./image.png');
//         console.log('PDF Buffer:', pdfBuffer);
//         // Simpan PDF ke file
//         fs.writeFileSync('./output.pdf', pdfBuffer);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();
