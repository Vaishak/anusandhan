import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { processGoogleDriveFolders } from './googleDrive';
import { loadConfig } from './config';

const app = new Hono();

// Serve static files
app.use('/*', serveStatic({ root: './public' }));

// API endpoint to trigger Google Drive processing
app.post('/api/process', async (c) => {
  try {
    const config = loadConfig();
    await processGoogleDriveFolders(config);
    return c.json({ message: 'Processing complete' }, 200);
  } catch (error) {
    console.error('Error processing Google Drive folders:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Serve index.html for the root path
app.get('/', serveStatic({ path: './public/index.html' }));

export default {
  port: 3000,
  fetch: app.fetch,
};