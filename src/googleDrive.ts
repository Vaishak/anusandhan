import { drive_v3, google } from 'googleapis';
import type { AppConfig } from './config';
import { generateHtml } from './htmlGenerator';
import { writeFileSync } from 'fs';
import { join } from 'path';

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

async function getFolderContents(folderId: string): Promise<drive_v3.Schema$File[]> {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='text/markdown'`,
    fields: 'files(id, name, mimeType, modifiedTime)',
  });
  return res.data.files || [];
}

export async function processGoogleDriveFolders(config: AppConfig): Promise<void> {
  for (const folder of config.folders) {
    const files = await getFolderContents(folder.id);
    for (const file of files) {
      const content = await drive.files.get({
        fileId: file.id!,
        alt: 'media',
      });
      const htmlContent = generateHtml(content.data as string, folder.template);
      writeFileSync(join('public', 'generated', `${file.name}.html`), htmlContent);
    }
  }
}