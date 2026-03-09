import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";

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