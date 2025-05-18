import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createComplaint = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("complaints", {
      ...args,
      submitterId: userId,
      status: "pending",
    });
  },
});

export const listUserComplaints = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const complaints = await ctx.db
      .query("complaints")
      .withIndex("by_submitter", (q) => q.eq("submitterId", userId))
      .collect();

    return Promise.all(
      complaints.map(async (complaint) => {
        const category = await ctx.db.get(complaint.categoryId);
        const responses = await ctx.db
          .query("responses")
          .withIndex("by_complaint", (q) => q.eq("complaintId", complaint._id))
          .collect();
        return { ...complaint, category, responses };
      })
    );
  },
});

export const listCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const addResponse = mutation({
  args: {
    complaintId: v.id("complaints"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const official = await ctx.db
      .query("officials")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const user = await ctx.db.get(userId);

    // Add the response
    await ctx.db.insert("responses", {
      ...args,
      responderName: official ? `${official.title} - ${user?.name ?? "Official"}` : user?.name ?? "Anonymous",
      isOfficial: !!official,
    });

    // Update complaint status if response is from official
    if (official) {
      await ctx.db.patch(args.complaintId, { status: "responded" });
    }
  },
});

export const isOfficial = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const official = await ctx.db
      .query("officials")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return !!official;
  },
});

export const getOfficialCategory = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const official = await ctx.db
      .query("officials")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!official) return null;

    return await ctx.db.get(official.categoryId);
  },
});

export const listCategoryComplaints = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const official = await ctx.db
      .query("officials")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!official) return [];

    const complaints = await ctx.db
      .query("complaints")
      .withIndex("by_category", (q) => q.eq("categoryId", official.categoryId))
      .collect();

    return Promise.all(
      complaints.map(async (complaint) => {
        const category = await ctx.db.get(complaint.categoryId);
        const submitter = await ctx.db.get(complaint.submitterId);
        const responses = await ctx.db
          .query("responses")
          .withIndex("by_complaint", (q) => q.eq("complaintId", complaint._id))
          .collect();
        return {
          ...complaint,
          category,
          submitter: submitter?.name ?? "Anonymous",
          responses
        };
      })
    );
  },
});
