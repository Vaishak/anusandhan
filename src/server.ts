import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { loadConfig } from './config';
import { processMarkdowns } from './markdownProcessor';
import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenvConfig();

const app = new Hono();
const config = loadConfig();

// Update this function to check for credentials using GOOGLE_APPLICATION_CREDENTIALS
function checkCredentials() {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    console.error('Error: GOOGLE_APPLICATION_CREDENTIALS is not set in the environment variables.');
    process.exit(1);
  }

  if (!existsSync(credentialsPath)) {
    console.error(`Error: The file specified by GOOGLE_APPLICATION_CREDENTIALS (${credentialsPath}) does not exist.`);
    process.exit(1);
  }

  console.log(`Using Google credentials from: ${credentialsPath}`);
}

// Call this function before starting the server
checkCredentials();

// Serve static files
app.use('/*', serveStatic({ root: config.outputPath }));

// Serve index.html for the root path
app.get('/', serveStatic({ path: `${config.outputPath}/index.html` }));

// Serve admin page
app.get('/admin', serveStatic({ path: `${config.outputPath}/admin.html` }));

// API endpoint to trigger manual processing
app.post('/api/process', async (c) => {
  try {
    await processMarkdowns(config);
    return c.json({ message: 'Processing complete' }, 200);
  } catch (error) {
    console.error('Error processing files:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Initialize background processing if enabled
async function startPolling() {
  while (config.polling.enabled) {
    try {
      await processMarkdowns(config);
    } catch (error) {
      console.error('Error during polling:', error);
    }
    await new Promise(resolve => setTimeout(resolve, config.polling.interval));
  }
}

if (config.polling.enabled) {
  console.log('Starting automatic polling...');
  startPolling();
} else {
  console.log('Automatic polling is disabled. Use the admin page to process files manually.');
}

// Initial processing on server start
processMarkdowns(config).then(() => {
  console.log('Initial processing complete.');
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
