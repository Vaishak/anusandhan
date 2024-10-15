import { marked } from 'marked';

export function generateHtml(content: string, template: string): string {
  const htmlContent = marked(content);
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Page</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <div class="content">
            ${htmlContent}
        </div>
    </body>
    </html>
  `;
}