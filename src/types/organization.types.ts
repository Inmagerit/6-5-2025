import { AddressSchema } from "./commons.types";
import { UserSchema } from "./user.types";

export type OrganizationSchema = {
    id: string;
    name: string;
    description: string;
    address: AddressSchema;
    type: string;
    creator_id: string;
    created_at: string;
    updated_at: string;
};

export type OrganizationDataAccessSchema = {
    id: string;
    target_organization_id: string;
    organization_id: string;
    auditor_id: string;
    created_at: string;
};

export type OrganizationDataAccessRequestSchema = {
    id: string;
    requester_id: string;
    requester: UserSchema;
    requester_organization_id: string;
    requester_organization: OrganizationSchema;
    target_organization_id: string;
    target_organization: OrganizationSchema;
    auditor_id: string;
    status: string;
    created_at: string;
    accepted_at: string;
    reject_reason: string;
    rejected_at: string;
};

export type CreateOrganizationRequest = {
    name: string;
    description: string;
    address: AddressSchema;
};

export type UpdateOrganizationRequest = {
    name: string;
    description: string;
    address: AddressSchema;
};

export type CreateOrganizationDataAccessRequest = {
    target_organization_id: string;
};

export type RejectOrganizationDataAccessRequest = {
    reject_reason: string;
};
