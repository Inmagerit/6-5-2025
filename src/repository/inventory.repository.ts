import { client } from "@/lib/axios-client";
import {
    AddProductRequest,
    MoveProductRequest,
    ProductEntry,
    UpdateProductRequest,
} from "@/types/product.types";
import { AxiosResponse } from "axios";

const PREFIX = "product-types";

export async function getProductById(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "GET",
    });
}

export async function updateProduct(productId: string, data: UpdateProductRequest): Promise<void> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "PUT",
        data,
    });
}

export async function deleteProduct(productId: string): Promise<void> {
    return client.request({
        url: `${PREFIX}/${productId}`,
        method: "DELETE",
    });
}

export async function allocateProduct(
    productId: string,
    data: AddProductRequest
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}/allocate`,
        method: "POST",
        data,
    });
}

export async function reallocateProduct(
    productId: string,
    data: MoveProductRequest
): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}/reallocate`,
        method: "POST",
        data,
    });
}

export async function getAllocations(
    productId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: ProductEntry[] }>> {
    return client.request({
        url: `${PREFIX}/${productId}/allocations?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function getDonations(
    productId: string,
    offset: number,
    limit: number
): Promise<AxiosResponse<{ count: number; data: any[] }>> {
    return client.request({
        url: `${PREFIX}/${productId}/donations?offset=${offset}&limit=${limit}`,
        method: "GET",
    });
}

export async function getStorageRecords(productId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${productId}/storage-records`,
        method: "GET",
    });
}
