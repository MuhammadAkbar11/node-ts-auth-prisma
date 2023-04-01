import { ROLES, USER_STATUS } from "../../configs/vars.config";

export type ModeTypes = "development" | "production" | "testing";
export type UserStatusTypes = keyof typeof USER_STATUS;
export type RoleTypes = keyof typeof ROLES;
