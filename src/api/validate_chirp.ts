import { Request, Response } from "express";

export async function handler(req: Request, res: Response) {
    return new Promise((resolve) => {
        let body = "";
    
        req.on("data", (chunk) => {
            body += chunk;
        });

        res.header("Content-Type", "application/json");
        
        req.on("end", () => {
            try {
                const parsedBody = JSON.parse(body);

                if (!parsedBody.body) {
                    res.status(400).json({"error": "Something went wrong"});
                    resolve(null);
                    return;
                }

                if (parsedBody.body.length > 140) {
                    res.status(400).json({"error": "Chirp is too long"});
                    resolve(null);
                    return;
                }
                res.status(200).send({"valid": true});
                resolve(null);

            } catch (error) {
                res.status(400).send({"error": "Something went wrong"});
                resolve(null);
            }
        });
    });
}