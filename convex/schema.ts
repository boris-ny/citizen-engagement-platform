import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  categories: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  complaints: defineTable({
    title: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    status: v.string(),
    submitterId: v.id("users"),
    location: v.string(),
    attachmentId: v.optional(v.id("_storage")),
    attachmentName: v.optional(v.string()),
  })
    .index("by_submitter", ["submitterId"])
    .index("by_category", ["categoryId"])
    .index("by_status", ["status"]),

  responses: defineTable({
    complaintId: v.id("complaints"),
    responderName: v.string(),
    message: v.string(),
    isOfficial: v.boolean(),
  }).index("by_complaint", ["complaintId"]),

  officials: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    title: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_category", ["categoryId"]),

  admins: defineTable({
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
