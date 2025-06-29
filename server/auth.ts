import type { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// Middleware to check if user's email is whitelisted
export async function requireWhitelistedEmail(req: Request, res: Response, next: NextFunction) {
  try {
    // For development, you can bypass this check
    if (process.env.NODE_ENV === 'development' && process.env.SKIP_EMAIL_WHITELIST === 'true') {
      return next();
    }

    // Extract email from request (you'll need to implement your auth system)
    // For now, let's use a simple approach with query parameter or header
    const email = req.query.email as string || req.headers['x-user-email'] as string;
    
    if (!email) {
      return res.status(401).json({ 
        message: "Access restricted to NewGiza residents only. Please provide your registered email address.",
        requiresAuth: true 
      });
    }

    // Check if email is whitelisted
    const isWhitelisted = await storage.isEmailWhitelisted(email);
    
    if (!isWhitelisted) {
      return res.status(403).json({ 
        message: "Access denied. Your email is not registered as a NewGiza resident. Please contact the community admin.",
        email: email
      });
    }

    // Email is whitelisted, allow access
    req.userEmail = email;
    next();
  } catch (error) {
    console.error("Error checking email whitelist:", error);
    res.status(500).json({ message: "Authentication service unavailable" });
  }
}

// Middleware for public endpoints that don't require whitelist
export function allowPublicAccess(req: Request, res: Response, next: NextFunction) {
  next();
}

// Create a simple function that can be used inline instead of middleware
// This avoids the sessions dependency issue
export function createCvOwnerOrAdminCheck(sessions: Map<string, { email: string; isAdmin: boolean; timestamp: number }>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cvId = parseInt(req.params.id);
      
      // Get the CV to check ownership
      const cv = await storage.getCvShowcase(cvId);
      if (!cv) {
        return res.status(404).json({ message: "CV not found" });
      }

      // Check for session-based auth (both admin and CV owner sessions)
      const sessionId = req.cookies?.sessionId;
      const session = sessionId ? sessions.get(sessionId) : null;
      
      if (!session || Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
        if (session) sessions.delete(sessionId);
        return res.status(401).json({ message: "Authentication required to edit this CV" });
      }

      // Check if user can edit this CV (only owner or admin)
      if (!session.isAdmin && session.email !== cv.email.toLowerCase()) {
        return res.status(403).json({ message: "Unauthorized to edit this CV" });
      }
      
      return next();
      
    } catch (error) {
      console.error("Error in CV owner/admin check:", error);
      res.status(500).json({ message: "Authentication service error" });
    }
  };
}

// Type extension for Request
declare global {
  namespace Express {
    interface Request {
      userEmail?: string;
    }
  }
}