import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { errorMiddleWare, middlewareMetricsInc } from "./api/middleware.js";
import { handlerHits } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { handlerChirpsValidate } from "./api/chirps.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser } from "./api/users.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use(express.json());
app.get("/api/healthz",  (req, res, next) => {
   Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.get("/admin/metrics", (req, res, next) => {
   Promise.resolve(handlerHits(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
   Promise.resolve(handlerReset(req, res)).catch(next);
});
app.post("/api/validate_chirp", (req, res, next) => {
   Promise.resolve(handlerChirpsValidate(req, res)).catch(next);
});

app.post("/api/users", (req, res, next) => {
   Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.use(errorMiddleWare);

app.listen(PORT, () => {
   console.log(`Server is running...`);
});
