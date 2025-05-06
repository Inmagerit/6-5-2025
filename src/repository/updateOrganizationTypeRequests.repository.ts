import { client } from "@/lib/axios-client";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { AxiosResponse } from "axios";

const PREFIX = "update-organization-type-requests";

export async function createRequest(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function findRequests(
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: UpdateOrganizationTypeRequestSchema[] }>> {
    return client.request({
        url: `${PREFIX}?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function acceptRequest(requestId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${requestId}/accept`,
        method: "PUT",
    });
}

export async function rejectRequest(
    requestId: string,
    rejectReason: string
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${requestId}/reject`,
        method: "PUT",
        data: { reject_reason: rejectReason },
    });
}
