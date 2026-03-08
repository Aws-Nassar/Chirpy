import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";



/*
export function respondWithError(res: Response, code: number, message: string) {
  respondWithJSON(res, code, { error: message });
}*/ // Not used

export function respondWithJSON(res: Response, code: number, payload: any) {
  res.header("Content-Type", "application/json");
  const body = JSON.stringify(payload);
  res.status(code).send(body);
}

export async function handlerChirpsValidate(req: Request, res: Response) {
  const { body } = req.body;

  if (!body) {
    throw new BadRequestError("Missing body");
  }

  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const profaneWords: string[] = ['kerfuffle', 'sharbert', 'fornax'];
  const cleanBody: Array<string> =  body.split(" ");
  
  for ( let i = 0; i < cleanBody.length; i++) {
    if (profaneWords.includes(cleanBody[i].toLowerCase())) {
      cleanBody[i] = "****";
    }
  }
  

  respondWithJSON(res, 200, {
    cleanedBody: cleanBody.join(" "),
  });
}