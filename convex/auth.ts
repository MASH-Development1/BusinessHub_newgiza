import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Generate a random session ID
function generateSessionId(): string {
  return Math.random().toString(36).substring(7);
}

// Check if email is whitelisted
export const isEmailWhitelisted = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const whitelisted = await ctx.db
      .query("email_whitelist")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
    
    return !!whitelisted;
  },
});

// Login with email (check whitelist) - same logic as Express.js
export const loginWithEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();
    
    // Check if email is whitelisted
    const whitelisted = await ctx.db
      .query("email_whitelist")
      .withIndex("email", (q) => q.eq("email", email))
      .first();
    
    if (!whitelisted) {
      throw new Error("Access denied. Your email is not registered as a NewGiza resident. Please contact the community administrator.");
    }

    // Check if user exists
    let user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", email))
      .first();

    // If user doesn't exist, create one
    if (!user) {
      const userId = await ctx.db.insert("users", {
        email: email,
        name: whitelisted.name || "User",
        role: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      user = await ctx.db.get(userId);
    }

    // Create session
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    await ctx.db.insert("sessions", {
      session_id: sessionId,
      email: email,
      is_admin: false,
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
    });

    return {
      sessionId,
      user: user!,
      message: "Login successful"
    };
  },
});

// Admin login with hardcoded credentials - same logic as Express.js
export const adminLogin = mutation({
  args: { 
    username: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    // Hardcoded admin credentials
    const ADMIN_EMAIL = "admin@newgiza.com";
    const ADMIN_PASSWORD = "NewGiza@2025!";
    
    if (args.username !== ADMIN_EMAIL || args.password !== ADMIN_PASSWORD) {
      throw new Error("Invalid admin credentials");
    }

    // Check if admin user exists
    let adminUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", ADMIN_EMAIL))
      .first();

    // If admin user doesn't exist, create one
    if (!adminUser) {
      const userId = await ctx.db.insert("users", {
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      adminUser = await ctx.db.get(userId);
    }

    // Create admin session
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    await ctx.db.insert("sessions", {
      session_id: sessionId,
      email: ADMIN_EMAIL,
      is_admin: true,
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
    });

    return {
      sessionId,
      user: adminUser!,
      message: "Admin login successful"
    };
  },
});

// Get current user from session - same logic as Express.js /api/auth/me
export const getCurrentUser = query({
  args: { sessionId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    console.log("[Convex] getCurrentUser called with sessionId:", args.sessionId);
    if (!args.sessionId) {
      console.log("[Convex] No sessionId provided");
      return null;
    }

    const session = await ctx.db
      .query("sessions")
      .withIndex("session_id", (q) => q.eq("session_id", args.sessionId!))
      .first();
    console.log("[Convex] Session found:", session);

    if (!session || new Date(session.expires_at) < new Date()) {
      console.log("[Convex] Session not found or expired");
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", session.email))
      .first();
    console.log("[Convex] User found:", user);

    if (!user) {
      console.log("[Convex] User not found for session");
      return null;
    }

    return {
      email: session.email,
      isAdmin: session.is_admin,
      isAuthenticated: true,
      user: user
    };
  },
});

// Logout - same logic as Express.js
export const logout = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("session_id", (q) => q.eq("session_id", args.sessionId))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { message: "Logged out successfully" };
  },
});

// Helper function to create an admin user (for testing)
export const createAdminUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      // Update existing user to admin
      await ctx.db.patch(existingUser._id, {
        role: "admin",
        updated_at: new Date().toISOString(),
      });
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return userId;
  },
});

// Add test email to whitelist (for testing)
export const addTestEmailToWhitelist = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingEmail = await ctx.db
      .query("email_whitelist")
      .withIndex("email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existingEmail) {
      return existingEmail._id;
    }

    const emailId = await ctx.db.insert("email_whitelist", {
      email: args.email.toLowerCase(),
      name: args.name || "Test User",
      unit: null,
      phone: null,
      is_active: true,
      added_by: "system",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return emailId;
  },
});

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.union(v.literal("user"), v.literal("admin"), v.literal("recruiter"))),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      role: args.role || "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return userId;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    updates: v.object({
      name: v.optional(v.string()),
      role: v.optional(v.union(v.literal("user"), v.literal("admin"), v.literal("recruiter"))),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const updates = {
      ...args.updates,
      updated_at: new Date().toISOString(),
    };

    await ctx.db.patch(args.id, updates);
  },
});

export const deleteUser = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }

    // Only allow admins to delete users
    const currentUser = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (currentUser?.role !== "admin") {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
}); 