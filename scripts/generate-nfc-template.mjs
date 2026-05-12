import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/templates');
const outFile = path.join(outDir, 'surat-permohonan-pindah-pemilik-nfc.docx');

const line = (text, opts = {}) =>
    new Paragraph({
        children: [new TextRun({ text, size: 22, ...opts })],
        spacing: { after: 120 },
    });

const boldLine = (text) => line(text, { bold: true });

const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                new Paragraph({
                    heading: HeadingLevel.TITLE,
                    spacing: { after: 240 },
                    children: [
                        new TextRun({
                            text: 'FORMULIR PERMOHONAN PINDAH KEPEMILIKAN CHIP NFC PRODUK SAZIME',
                            bold: true,
                            size: 28,
                        }),
                    ],
                }),
                line(
                    'Isi formulir ini dengan huruf cetak, lengkapi, tanda tangani, lalu scan/foto atau simpan sebagai PDF sebelum diunggah pada halaman permintaan transfer.'
                ),
                boldLine('A. DATA PRODUK (diisi sesuai hasil cek NFC)'),
                line('ID NFC              : _______________________________________________'),
                line('ID Produk           : _______________________________________________'),
                line('Nama Produk         : _______________________________________________'),
                line('Nomor Seri          : _______________________________________________'),
                boldLine('B. PIHAK YANG BERSANGKUTAN'),
                boldLine('Pemilik Terdaftar (lama) :'),
                line('  Nama lengkap      : _______________________________________________'),
                line('  NIK / identitas   : _______________________________________________'),
                line('  No. HP            : _______________________________________________'),
                line('  Alamat            : _______________________________________________'),
                line('                      _______________________________________________'),
                boldLine('Pemohon (pemilik baru) :'),
                line('  Nama lengkap      : _______________________________________________'),
                line('  NIK / identitas   : _______________________________________________'),
                line('  No. HP            : _______________________________________________'),
                line('  Alamat            : _______________________________________________'),
                line('                      _______________________________________________'),
                boldLine('C. PERNYATAAN'),
                line(
                    'Dengan ini saya menyatakan bahwa data di atas benar, dan pemindahan kepemilikan chip NFC dilakukan secara sukarela sesuai kesepakatan pihak lama dan pihak baru. Saya bersedia mematuhi kebijakan verifikasi yang ditetapkan oleh Sazime.'
                ),
                boldLine('D. TANDA TANGAN'),
                line('Tempat, tanggal     : _______________________, _______________________'),
                line(''),
                line('Tanda tangan pemilik terdaftar (lama)'),
                line(''),
                line('(_____________________________)'),
                line('Nama jelas'),
                line(''),
                line('Tanda tangan pemohon (pemilik baru)'),
                line(''),
                line('(_____________________________)'),
                line('Nama jelas'),
                line(''),
                line('Catatan: Lampirkan salinan identitas (KTP/SIM) jika diperlukan oleh admin.'),
            ],
        },
    ],
});

const buffer = await Packer.toBuffer(doc);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, buffer);
console.log('Wrote', outFile);
