import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export async function downloadSingleFile(url, filename) {
  const res = await fetch(url);
  const blob = await res.blob();
  saveAs(blob, filename || 'document');
}

export async function downloadAllAsZip(files, zipName = 'documents.zip') {
  const zip = new JSZip();
  await Promise.all(
    files.map(async (f, idx) => {
      try {
        const res = await fetch(f.url);
        const blob = await res.blob();
        const name = f.filename || `document_${idx + 1}`;
        zip.file(name, blob);
      } catch (e) {
        // Skip files that fail to fetch (e.g. CORS) but keep going for the rest.
        // eslint-disable-next-line no-console
        console.warn('Could not add file to zip:', f.filename, e);
      }
    })
  );
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, zipName);
}
