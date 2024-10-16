import { marked } from 'marked';
import * as fs from 'fs';
import * as path from 'path';
import type { AppConfig } from './config';
import { listMarkdownFiles, getFileContent, exportGoogleDoc } from './driveService';

export async function processMarkdowns(config: AppConfig) {
  const files = await listMarkdownFiles(config);
  for (const file of files) {
    let content: string;
    if (file.mimeType === 'application/vnd.google-apps.document') {
      content = await exportGoogleDoc(file.id!);
    } else {
      content = await getFileContent(file.id!);
    }
    const htmlContent = marked(content);
    const outputPath = path.join(config.markdownsPath, `${file.name}.html`);
    fs.writeFileSync(outputPath, wrapHtmlContent(htmlContent, file.name));
  }
  generateIndexPage(config);
  generateAdminPage(config);
}

function wrapHtmlContent(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <div class="content">
            ${content}
        </div>
    </body>
    </html>
  `;
}

function generateIndexPage(config: AppConfig) {
  const files = fs.readdirSync(config.markdownsPath).filter(file => file.endsWith('.html'));
  let indexContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown Files</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <h1>Markdown Files</h1>
        <div class="card-container">
  `;

  files.forEach(file => {
    const name = path.basename(file, '.html');
    indexContent += `
      <div class="card">
        <h2>${name}</h2>
        <a href="/markdowns/${file}">View</a>
      </div>
    `;
  });

  indexContent += `
        </div>
    </body>
    </html>
  `;

  fs.writeFileSync(path.join(config.outputPath, 'index.html'), indexContent);
}

export function generateAdminPage(config: AppConfig) {
  const adminContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin - Process Files</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <h1>Admin - Process Files</h1>
        <button id="processButton">Process Files</button>
        <p id="status"></p>
        <script>
            document.getElementById('processButton').addEventListener('click', async () => {
                const status = document.getElementById('status');
                status.textContent = 'Processing...';
                try {
                    const response = await fetch('/api/process', { method: 'POST' });
                    if (response.ok) {
                        status.textContent = 'Processing complete!';
                    } else {
                        status.textContent = 'Error processing files.';
                    }
                } catch (error) {
                    status.textContent = 'Error: ' + error.message;
                }
            });
        </script>
    </body>
    </html>
  `;

  fs.writeFileSync(path.join(config.outputPath, 'admin.html'), adminContent);
}
