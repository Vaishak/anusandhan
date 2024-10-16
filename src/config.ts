import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { config } from 'dotenv';

config(); // Load .env file

export interface AppConfig {
  entryFolder: string;
  polling: {
    enabled: boolean;
    interval: number; // in milliseconds
  };
  outputPath: string;
  markdownsPath: string;
}

export function loadConfig(): AppConfig {
  const configFile = readFileSync('config.yaml', 'utf8');
  return parse(configFile) as AppConfig;
}