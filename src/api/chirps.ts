import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js"
import { config } from "../config.js";

export async function handlerCreateChirps(req: Request, res: Response) {
  const { body } = req.body;

  if (!body) {
    throw new BadRequestError("Missing body");
  }

  const tokenString = getBearerToken(req);

  const userId = validateJWT(tokenString, config.jwt.secret)

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

export async function handlerGetAllChirps(req: Request, res: Response) {
  const results = await getAllChirps();

  if (!results) {
    throw new Error("Error happen while we get all the chirps.")
  }

  let chirpsArray = [];
  for (let i = 0; i < results.length; i++) {
    chirpsArray.push({
      "id": results[i].id,
      "createdAt": results[i].createdAt,
      "updatedAt": results[i].updatedAt,
      "body": results[i].body,
      "userId": results[i].userId
    });
  }

  respondWithJSON(res, 200, chirpsArray);
}

export async function handlerGetChirpById(req: Request, res: Response,) {
  const { chirpId } = req.params;

  if (typeof chirpId !== 'string') {
      throw new NotFoundError("Missing chirpId parameter.");
  }

  const result = await getChirpById(chirpId);

  if (!result) {
    throw new NotFoundError("Error happen while we get the needed chirp.");
  }

  respondWithJSON(res, 200, {
    "id": result.id,
    "createdAt": result.createdAt,
    "updatedAt": result.updatedAt,
    "body": result.body,
    "userId": result.userId
  });
}
