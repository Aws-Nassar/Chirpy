import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("token", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;

  beforeAll( () => {
    hash1 =  makeJWT("1242435", 3600, password1);
  });

  it("should return true for the correct password", () => {
    const result = validateJWT(hash1, password1);
    expect(result).toBe("1242435");
  });
  it("should throw error", () => {
    expect(() => validateJWT(hash1, password2)).toThrow()
  });
});