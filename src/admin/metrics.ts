import { config } from "../config.js";
import type { Request, Response } from "express";

export async function handlerHits (req: Request, res: Response): Promise<void> {
    //res.send(`Hits: ${config.fileServerHits}`);

    const html = `
    <html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
        </body>
    </html>
    `;
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
    });
    res.end(html);
}
