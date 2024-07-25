import { nullThrows } from "convex-helpers";
import { asyncMap } from "convex-helpers";

export async function getAllOrThrow(db: any, ids: any) {
  return await asyncMap(ids, async (id) => nullThrows(await db.get(id)));
}