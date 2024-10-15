import { readFileSync } from 'fs';
import { parse } from 'yaml';

interface FolderConfig {
  id: string;
  template: string;
}

export interface AppConfig {
  folders: FolderConfig[];
}

export function loadConfig(): AppConfig {
  const configFile = readFileSync('config.yaml', 'utf8');
  return parse(configFile) as AppConfig;
}