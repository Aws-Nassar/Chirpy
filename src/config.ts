type APIConfig = {
  fileServerHits: number;
  dbURL: string;
};

process.loadEnvFile();

export const config: APIConfig = {
  fileServerHits: 0,
  dbURL: envOrThrow("DB_URL"),
};

function envOrThrow(key: string) : string {
  const value = process.env[key];
  
  if (!value) {
    throw new Error(`Missing Enviroment variable: ${key}`);
  }

  return value;
}
