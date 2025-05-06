import { CreateUserRequest, UserPreferencesSchema } from "./user.types";

export type SignInRequest = {
    email: string;
    password: string;
};

export type SignUpRequest = CreateUserRequest;

export type SignUpByInviteRequest = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phones: Array<string>;
    role: string;
    organization_id: string;
    preferences: UserPreferencesSchema;
};

export type SignUpAdminByInviteRequest = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phones: Array<string>;
    role: string;
    preferences: UserPreferencesSchema;
};

export type PasswordChangeRequestSchema = {
    user_id: string;
    code: string;
    expires_at: string;
};

export type SessionSchema = {
    id: string;
    user_id: string;
    expires_at: string;
};

export type RequestPasswordChangeRequest = {
    email: string;
};

export type UpdatePasswordRequest = {
    new_password: string;
};
