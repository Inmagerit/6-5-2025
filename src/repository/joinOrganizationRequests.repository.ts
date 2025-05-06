import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "join-organization-requests";

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
        data: {
            reject_reason: rejectReason,
        },
    });
}
