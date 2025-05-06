import { client } from "@/lib/axios-client";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { UpdateSpaceRequest } from "@/types/space.types";
import { AxiosResponse } from "axios";

const PREFIX = "housing-rooms";

export async function getSpaceById(spaceId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${spaceId}`,
        method: "GET",
    });
}

export async function updateSpace(spaceId: string, data: UpdateSpaceRequest): Promise<void> {
    return client.request({
        url: `${PREFIX}/${spaceId}`,
        method: "PUT",
        data,
    });
}

export async function deleteSpace(spaceId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${spaceId}`,
        method: "DELETE",
    });
}

export async function getBeneficiariesBySpaceId(
    spaceId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: BeneficiarySchema[] }>> {
    return client.request({
        url: `${PREFIX}/${spaceId}/beneficiaries?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function getAllocationsBySpaceId(spaceId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${spaceId}/allocations`,
        method: "GET",
    });
}
