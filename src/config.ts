import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

type APIConfig = {
  fileServerHits: number;
  platform: string;
};

process.loadEnvFile();

type Config = {
  api: APIConfig;
  db: DBConfig;
}

export const config: Config = {
  api: {
    fileServerHits: 0,
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig
  }
};

function envOrThrow(key: string) : string {
  const value = process.env[key];
    
  if (!value) {
    throw new Error(`Missing Enviroment variable: ${key}`);
  }

  return value;
}
