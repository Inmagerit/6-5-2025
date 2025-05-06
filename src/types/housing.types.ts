import { AddressSchema } from "./commons.types";

export type HousingSchema = {
    id: string;
    organization_id: string;
    name: string;
    status: string;
    address: AddressSchema;
    occupied_vacancies: number;
    total_vacancies: number;
    total_rooms: number;
    created_at: string;
    updated_at: string;
};

export type CreateHousingRequest = Omit<
    HousingSchema,
    | "id"
    | "organization_id"
    | "status"
    | "created_at"
    | "updated_at"
    | "occupied_vacancies"
    | "total_vacancies"
    | "total_rooms"
>;

export type UpdateHousingRequest = Omit<
    HousingSchema,
    | "id"
    | "organization_id"
    | "status"
    | "created_at"
    | "updated_at"
    | "occupied_vacancies"
    | "total_vacancies"
    | "total_rooms"
>;
