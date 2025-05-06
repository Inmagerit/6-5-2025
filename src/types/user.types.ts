import { OrganizationSchema } from "@/types/organization.types";

export type UserPreferencesSchema = {
    language: string;
    timezone: string;
};

export type UserSchema = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phones: Array<string>;
    role: string;
    platform_role: "ORG_MEMBER" | "ORG_ADMIN" | "NO_ORG" | "RELIF_MEMBER";
    status: string;
    preferences: UserPreferencesSchema;
    created_at: string;
    updated_at: string;
    organization_id: string | null;
    organization: OrganizationSchema;
};

export type CreateUserRequest = Omit<
    UserSchema | "password",
    | "id"
    | "platform_role"
    | "status"
    | "created_at"
    | "updated_at"
    | "organization_id"
    | "organization"
>;

export type UpdateUserRequest = Omit<
    UserSchema,
    "id" | "status" | "created_at" | "updated_at" | "organization_id" | "organization"
>;
