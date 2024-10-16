# Anusandhan 

This project is a web application built with Bun and Hono that processes Markdown files from Google Drive and serves them as HTML pages.

## Features

- Fetches Markdown files from a specified Google Drive folder
- Converts Markdown to HTML
- Serves static files and generated HTML pages
- Provides an index page for all processed files
- Includes an admin page for manual processing

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Google Cloud project with Drive API enabled
- Google Cloud service account with access to the target Drive folder

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/google-drive-markdown-processor.git
   cd google-drive-markdown-processor
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up your Google Cloud service account key (see Configuration section)

## Configuration

1. Obtain a Google Cloud service account key and save it as `your-service-account-key.json` in the project root.

2. Create a `.env` file in the project root with the following content:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=your-service-account-key.json
   ```

3. Update the `config.ts` file with your Google Drive folder ID and other settings.

## Usage

1. Start the server:
   ```
   bun run src/server.ts
   ```

2. Open a web browser and navigate to `http://localhost:3000`

3. View the index page to see all processed Markdown files

4. Access the admin page at `http://localhost:3000/admin` to manually trigger processing

## Development

This project uses TypeScript. Make sure to run `bun run typecheck` before committing to ensure type safety.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
