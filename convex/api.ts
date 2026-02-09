/**
 * Convex API export
 * This is a placeholder until Convex generates the real API.
 * 
 * After running `npx convex dev`, the generated file at `convex/_generated/api.js`
 * will contain the actual API exports. Update this file to:
 * 
 * export { api } from "../../convex/_generated/api";
 * export type Doc = import("../../convex/_generated/dataModel").Doc;
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunc = any;

// Placeholder API object - these are function references that Convex uses
export const api = {
  organizations: {
    getCurrent: "organizations:getCurrent" as AnyFunc,
    listForUser: "organizations:listForUser" as AnyFunc,
    switchOrg: "organizations:switchOrg" as AnyFunc,
    getMembers: "organizations:getMembers" as AnyFunc,
  },
  users: {
    getCurrent: "users:getCurrent" as AnyFunc,
    getCurrentWithOrg: "users:getCurrentWithOrg" as AnyFunc,
  },
  projects: {
    list: "projects:list" as AnyFunc,
    get: "projects:get" as AnyFunc,
    create: "projects:create" as AnyFunc,
    update: "projects:update" as AnyFunc,
    remove: "projects:remove" as AnyFunc,
  },
};

// Placeholder Doc type until generated
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Doc<_T extends string> = unknown;
