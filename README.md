Bun Markdown Processor
This project is a web application built with Bun and Hono that processes Markdown files from Google Drive and serves them as HTML pages.
Features

Fetches Markdown files from specified Google Drive folders
Converts Markdown to HTML
Serves static files and generated HTML pages
Provides an API endpoint to trigger processing

Prerequisites

Bun installed on your system
Google Drive API credentials

Installation

Clone the repository:
Copygit clone https://github.com/yourusername/bun-markdown-processor.git
cd bun-markdown-processor

Install dependencies:
Copybun install

Set up your Google Drive API credentials (see Configuration section)
Create a config.yaml file with your Google Drive folder IDs

Configuration

Obtain Google Drive API credentials and save the JSON file as credentials.json in the project root.
Create a config.yaml file in the project root with your Google Drive folder IDs:
yamlCopyfolders:
  - id: "your_google_drive_folder_id_1"
    template: "default"
  - id: "your_google_drive_folder_id_2"
    template: "custom"


Usage

Start the server:
Copybun run src/server.ts

Open a web browser and navigate to http://localhost:3000
Click the "Process Google Drive" button to fetch and process Markdown files

Development
This project uses TypeScript. Make sure to run bun run typecheck before committing to ensure type safety.
License
This project is licensed under the MIT License - see the LICENSE file for details.
