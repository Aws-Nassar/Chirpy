import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirps(req: Request, res: Response) {
  const { body,userId } = req.body;

  if (!body) {
    throw new BadRequestError("Missing body");
  }

  if (!userId) {
    throw new BadRequestError("Missing userId");
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

  const finalCleanBody: string = cleanBody.join(" ");

  const result = await createChirp({
    body: finalCleanBody, 
    userId: userId
  });

  if (!result) {
    throw new Error("Error happen while we add the new chirp.")
  }
  
  respondWithJSON(res, 201, {
  "id": result.id,
  "createdAt": result.createdAt,
  "updatedAt": result.updatedAt,
  "body": result.body,
  "userId": result.userId
  });
}