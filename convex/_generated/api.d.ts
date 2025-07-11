/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as accessRequests from "../accessRequests.js";
import type * as admin from "../admin.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as communityBenefits from "../communityBenefits.js";
import type * as courses from "../courses.js";
import type * as cvShowcase from "../cvShowcase.js";
import type * as internships from "../internships.js";
import type * as jobs from "../jobs.js";
import type * as profiles from "../profiles.js";
import type * as stats from "../stats.js";
import type * as whitelist from "../whitelist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  accessRequests: typeof accessRequests;
  admin: typeof admin;
  applications: typeof applications;
  auth: typeof auth;
  communityBenefits: typeof communityBenefits;
  courses: typeof courses;
  cvShowcase: typeof cvShowcase;
  internships: typeof internships;
  jobs: typeof jobs;
  profiles: typeof profiles;
  stats: typeof stats;
  whitelist: typeof whitelist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
