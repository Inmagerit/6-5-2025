import { client } from "@/lib/axios-client";
import {
    SignUpAdminByInviteRequest,
    SignUpByInviteRequest,
    SignUpRequest,
} from "@/types/auth.types";
import { UserSchema } from "@/types/user.types";
import { AxiosResponse } from "axios";

const PREFIX = "auth";

export async function signIn(email: string, password: string): Promise<string> {
    const { headers } = await client.request({
        url: `${PREFIX}/sign-in`,
        method: "POST",
        data: { email, password },
    });

    return headers.token;
}

export async function signOut(): Promise<void> {
    await client.request({
        url: `${PREFIX}/sign-out`,
        method: "DELETE",
    });
}

export async function signUp(data: SignUpRequest): Promise<string> {
    const { headers } = await client.request({
        url: `${PREFIX}/sign-up`,
        method: "POST",
        data: { ...data },
    });

    return headers.token;
}

export async function orgSignUp(data: SignUpByInviteRequest): Promise<string> {
    const { headers } = await client.request({
        url: `${PREFIX}/org-sign-up`,
        method: "POST",
        data,
    });

    return headers.token;
}

export async function adminSignUp(data: SignUpAdminByInviteRequest): Promise<string> {
    const { headers } = await client.request({
        url: `${PREFIX}/admin-sign-up`,
        method: "POST",
        data,
    });

    return headers.token;
}

export async function getMe(): Promise<AxiosResponse<UserSchema>> {
    return client.request({
        url: `${PREFIX}/me`,
        method: "GET",
    });
}
