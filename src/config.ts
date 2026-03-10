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

type JWTConfig = {
  secret: string;
  defaultDuration: number;
  refreshDuration: number;
}

process.loadEnvFile();

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
}

export const config: Config = {
  api: {
    fileServerHits: 0,
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig
  },
  jwt: {
    secret: envOrThrow("JWT_SECRET"),
    defaultDuration: 3600,
    refreshDuration: 5184000
  }
};

function envOrThrow(key: string) : string {
  const value = process.env[key];
    
  if (!value) {
    throw new Error(`Missing Enviroment variable: ${key}`);
  }

  return value;
}
