import { client } from "@/lib/axios-client";
import { AxiosResponse } from "axios";

const PREFIX = "join-platform-invites";

export async function createInvite(invitedEmail: string): Promise<AxiosResponse<void>> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
        data: { invited_email: invitedEmail },
    });
}

export async function consumeInvite(code: string): Promise<AxiosResponse<any>> {
    return client.request({
        url: `${PREFIX}/${code}/consume`,
        method: "DELETE",
    });
}
