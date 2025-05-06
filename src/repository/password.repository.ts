import { client } from "@/lib/axios-client";

const PREFIX = "password";

export async function requestChange(email: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/request-change`,
        method: "POST",
        data: { email },
    });
}

export async function updatePassword(code: string, newPassword: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${code}`,
        method: "PUT",
        data: { new_password: newPassword },
    });
}
