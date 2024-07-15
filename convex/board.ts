import { v } from "convex/values"
import { mutation } from "./_generated/server"

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
  "/placeholders/6.svg",
  "/placeholders/7.svg",
  "/placeholders/8.svg",
  "/placeholders/9.svg",
  "/placeholders/10.svg",
  "/placeholders/11.svg"
]

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string()
  },
  handler: async (ctx, args) => {
    const identitiy = await ctx.auth.getUserIdentity()
    if (!identitiy) {
      throw new Error("Unauthorized")
    }

    const randomImage = images[Math.floor(Math.random() * images.length)]
    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identitiy.subject,
      authorName: identitiy.name!,
      imageUrl: randomImage
    })

    return board
  }
})