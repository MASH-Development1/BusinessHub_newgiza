import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://superb-rabbit-686.convex.cloud";
console.log("[Convex] Using Convex URL:", convexUrl);
export const convex = new ConvexReactClient(convexUrl);

export { ConvexProvider }; 