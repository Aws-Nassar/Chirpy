import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { errorMiddleWare, middlewareMetricsInc } from "./api/middleware.js";
import { handlerHits } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { handlerCreateChirps, handlerDeleteChirp, handlerGetAllChirps, handlerGetChirpById } from "./api/chirps.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser, handlerUpdateUser, handlerUserLogin, handlerUpgradeChirpyRed } from "./api/users.js";
import { handlerRefresh, handlerRevoke } from "./api/refresh.js";

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
app.post("/api/chirps", (req, res, next) => {
   Promise.resolve(handlerCreateChirps(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
   Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
   Promise.resolve(handlerUserLogin(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
   Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
   Promise.resolve(handlerGetChirpById(req, res)).catch(next);
});
app.post("/api/refresh", (req, res, next) => {
   Promise.resolve(handlerRefresh(req, res)).catch(next);
});
app.post("/api/revoke", (req, res, next) => {
   Promise.resolve(handlerRevoke(req, res)).catch(next);
});
app.put("/api/users", (req, res, next) => {
   Promise.resolve(handlerUpdateUser(req, res)).catch(next);
});
app.delete("/api/chirps/:chirpId", (req, res, next) => {
   Promise.resolve(handlerDeleteChirp(req, res)).catch(next);
});
app.post("/api/polka/webhooks", (req, res, next) => {
   Promise.resolve(handlerUpgradeChirpyRed(req, res)).catch(next);
});

app.use(errorMiddleWare);

app.listen(PORT, () => {
   console.log(`Server is running...`);
});
