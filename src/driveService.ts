import { google } from 'googleapis';
import type { AppConfig } from './config';

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

export async function listMarkdownFiles(config: AppConfig) {
  const response = await drive.files.list({
    q: `'${config.entryFolder}' in parents and (mimeType='text/markdown' or mimeType='application/vnd.google-apps.document')`,
    fields: 'files(id, name, mimeType, modifiedTime)',
  });
  return response.data.files || [];
}

export async function getFileContent(fileId: string): Promise<string> {
  const response = await drive.files.get({
    fileId: fileId,
    alt: 'media',
  });
  return response.data as string;
}

export async function exportGoogleDoc(fileId: string): Promise<string> {
  const response = await drive.files.export({
    fileId: fileId,
    mimeType: 'text/markdown',
  });
  return response.data as string;
}
