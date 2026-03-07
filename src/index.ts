import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerHits } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.get("/healthz", handlerReadiness);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.get("/metrics", handlerHits);
app.get("/reset", handlerReset);


app.listen(PORT, () => {
   console.log(`Server is running...`);
});
