import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const isAdmin = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return !!admin;
  },
});

export const addOfficial = mutation({
  args: {
    email: v.string(),
    categoryId: v.id("categories"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!admin) throw new Error("Not authorized");

    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) throw new Error("User not found");

    // Check if already an official
    const existingOfficial = await ctx.db
      .query("officials")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingOfficial) throw new Error("User is already an official");

    // Add as official
    await ctx.db.insert("officials", {
      userId: user._id,
      categoryId: args.categoryId,
      title: args.title,
    });
  },
});

export const listOfficials = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!admin) return [];

    const officials = await ctx.db.query("officials").collect();

    return Promise.all(
      officials.map(async (official) => {
        const user = await ctx.db.get(official.userId);
        const category = await ctx.db.get(official.categoryId);
        return {
          ...official,
          email: user?.email,
          categoryName: category?.name,
        };
      })
    );
  },
});

export const addCategory = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    agencyEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user is admin
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!admin) throw new Error("Not authorized");

    await ctx.db.insert("categories", args);
  },
});
