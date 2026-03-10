import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import { config } from "../../config.js"
import { eq, and, isNull, gt } from 'drizzle-orm';

export async function saveRefreshToken(userID: string, token: string) {
  const rows = await db
    .insert(refreshTokens)
    .values({
      userId: userID,
      token: token,
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration * 1000),
      revokedAt: null,
    })
    .returning();

  return rows.length > 0;
}

export async function getUserFromRefreshToken(token: string) {
  const [result] = await db
    .select({ user: users })
    .from(refreshTokens)
    .innerJoin(users, eq(users.id, refreshTokens.userId))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date()),
      )
    )
    .limit(1);

  return result;
}

export async function revokeRefreshToken(token: string) {
  await db
  .update(refreshTokens)
  .set({revokedAt: new Date(), updatedAt: new Date()})
  .where(eq(refreshTokens.token, token));
}
    