import { client } from "@/lib/axios-client";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { CreateHousingRequest, HousingSchema, UpdateHousingRequest } from "@/types/housing.types";
import { CreateSpaceRequest, SpaceSchema } from "@/types/space.types";
import { AxiosResponse } from "axios";

const PREFIX = "housings";

export async function createHousing(
    data: CreateHousingRequest
): Promise<AxiosResponse<HousingSchema>> {
    return client.request({
        url: `${PREFIX}`,
        method: "POST",
        data,
    });
}

export async function getHousingById(housingId: string): Promise<AxiosResponse<HousingSchema>> {
    return client.request({
        url: `${PREFIX}/${housingId}`,
        method: "GET",
    });
}

export async function updateHousing(
    housingId: string,
    data: UpdateHousingRequest
): Promise<AxiosResponse<HousingSchema>> {
    return client.request({
        url: `${PREFIX}/${housingId}`,
        method: "PUT",
        data,
    });
}

export async function deleteHousing(housingId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}`,
        method: "DELETE",
    });
}

export async function getSpacesByHousingId(
    housingId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: SpaceSchema[] }>> {
    return client.request({
        url: `${PREFIX}/${housingId}/rooms?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function getBeneficiariesByHousingId(
    housingId: string,
    offset: number,
    limit: number,
    search: string
): Promise<AxiosResponse<{ count: number; data: BeneficiarySchema[] }>> {
    return client.request({
        url: `${PREFIX}/${housingId}/beneficiaries?offset=${offset}&limit=${limit}&search=${search}`,
        method: "GET",
    });
}

export async function getAllocationsByHousingId(
    housingId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}/allocations?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function createSpace(
    housingId: string,
    data: CreateSpaceRequest[]
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${housingId}/rooms`,
        method: "POST",
        data,
    });
}
