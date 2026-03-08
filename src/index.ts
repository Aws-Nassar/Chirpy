import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerHits } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { handler } from "./api/validate_chirp.js";
const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.get("/api/healthz", handlerReadiness);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handler);


app.listen(PORT, () => {
   console.log(`Server is running...`);
});
