import { client } from "@/lib/axios-client";
import { UpdateVoluntaryRequest, VoluntarySchema } from "@/types/voluntary.types";
import { AxiosResponse } from "axios";

const PREFIX = "voluntary-people";

export async function getVolunteerById(
    volunteerId: string
): Promise<AxiosResponse<VoluntarySchema>> {
    return client.request({
        url: `${PREFIX}/${volunteerId}`,
        method: "GET",
    });
}

export async function updateVolunteer(
    volunteerId: string,
    data: UpdateVoluntaryRequest
): Promise<void> {
    return client.request({
        url: `${PREFIX}/${volunteerId}`,
        method: "PUT",
        data,
    });
}

export async function deleteVolunteer(volunteerId: string): Promise<AxiosResponse> {
    return client.request({
        url: `${PREFIX}/${volunteerId}`,
        method: "DELETE",
    });
}
