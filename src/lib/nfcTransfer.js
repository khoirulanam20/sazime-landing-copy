export const TEMPLATE_DOC_PATH = '/templates/surat-permohonan-pindah-pemilik-nfc.docx';
export const MAX_DOKUMEN_BYTES = 1.5 * 1024 * 1024;
export const ACCEPT_DOKUMEN = '.pdf,.jpg,.jpeg,.png,.doc,.docx';

export function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Gagal membaca file'));
        reader.readAsDataURL(file);
    });
}
