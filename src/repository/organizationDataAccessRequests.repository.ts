import { client } from "@/lib/axios-client";
import { OrganizationDataAccessRequestSchema } from "@/types/organization.types";
import { AxiosResponse } from "axios";

const PREFIX = "organization-data-access-requests";

export async function findRequests(): Promise<
    AxiosResponse<OrganizationDataAccessRequestSchema[]>
> {
    return client.request({
        url: `${PREFIX}`,
        method: "GET",
    });
}

export async function acceptRequest(requestId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${requestId}/accept`,
        method: "PUT",
    });
}

export async function rejectRequest(requestId: string, rejectReason: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${requestId}/reject`,
        method: "PUT",
        data: { reject_reason: rejectReason },
    });
}
