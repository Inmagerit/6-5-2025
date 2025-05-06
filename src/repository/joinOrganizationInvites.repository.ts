import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "join-organization-invites";

export async function createInvite(): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
    });
}

export async function acceptInvite(inviteId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${inviteId}`,
        method: "DELETE",
    });
}

export async function rejectInvite(inviteId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${inviteId}`,
        method: "DELETE",
    });
}
