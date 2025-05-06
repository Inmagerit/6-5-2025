import { OrganizationSchema } from "./organization.types";
import { UserSchema } from "./user.types";

export type JoinOrganizationInviteSchema = {
    id: string;
    user_id: string;
    organization_id: string;
    creator_id: string;
    created_at: string;
    expires_at: string;
};

export type JoinOrganizationRequestSchema = {
    id: string;
    user_id: string;
    user: UserSchema;
    auditor_id: string;
    auditor: UserSchema;
    organization_id: string;
    organization: OrganizationSchema;
    created_at: string;
    expires_at: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    accepted_at: string;
    rejected_at: string;
    rejected_reason: string;
};

export type JoinPlatformInviteSchema = {
    id: string;
    code: string;
    organization_id: string;
    inviter_id: string;
    created_at: string;
    expires_at: string;
};

export type UpdateOrganizationTypeRequestSchema = {
    id: string;
    organization_id: string;
    organization: OrganizationSchema;
    creator_id: string;
    creator: UserSchema;
    auditor_id: string;
    auditor: UserSchema;
    status: string;
    created_at: string;
    accepted_at: string;
    reject_reason: string;
    rejected_at: string;
};

export type CreateJoinOrganizationInviteRequest = {
    organization_id: string;
};

export type CreateJoinOrganizationRequest = {
    organization_id: string;
};

export type CreateJoinPlatformInviteRequest = {
    invited_email: string;
};

export type CreateUpdateOrganizationTypeRequest = {
    organization_id: string;
};

export type RejectUpdateOrganizationTypeRequest = {
    reject_reason: string;
};
