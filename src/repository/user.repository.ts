import { client } from "@/lib/axios-client";
import { UpdateUserRequest, UserSchema } from "@/types/user.types";
import { AxiosResponse } from "axios";

const PREFIX = "users";

export async function findUser(userId: string): Promise<AxiosResponse<UserSchema>> {
    return client.request({
        url: `${PREFIX}/${userId}`,
        method: "GET",
    });
}

export async function getRelifUsers(
    offset: number,
    limit: number
): Promise<AxiosResponse<{ data: UserSchema[]; count: number }>> {
    return client.request({
        url: `${PREFIX}/relif-members?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function updateUser(userId: string, data: UpdateUserRequest): Promise<void> {
    return client.request({
        url: `${PREFIX}/${userId}`,
        method: "PUT",
        data,
    });
}

export async function reactiveUser(userId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${userId}/reactivate`,
        method: "PUT",
    });
}

export async function deleteUser(userId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${userId}`,
        method: "DELETE",
    });
}
