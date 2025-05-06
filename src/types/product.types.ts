import { OrganizationSchema } from "@/types/organization.types";

export type ProductSchema = {
    id: string;
    name: string;
    description: string;
    brand: string;
    category: string;
    organization_id: string;
    organization: OrganizationSchema;
    unit_type: string;
    total_in_storage: number;
    created_at: string;
    updated_at: string;
};

export type CreateProductRequest = Omit<
    ProductSchema,
    "id" | "organization_id" | "created_at" | "updated_at" | "organization" | "storage_records"
>;

export type UpdateProductRequest = Omit<
    ProductSchema,
    "id" | "organization_id" | "created_at" | "updated_at" | "organization" | "storage_records"
>;

export type MoveProductRequest = {
    from: {
        type: "ORGANIZATION" | "HOUSING";
        id: string;
    };
    to: {
        type: "ORGANIZATION" | "HOUSING";
        id: string;
    };
    quantity: number;
};

export type AddProductRequest = {
    to: {
        type: "ORGANIZATION" | "HOUSING";
        id: string;
    };
    quantity: number;
};

export type AllocationSchema = {
    id: string;
    location: {
        id: string;
        name: string;
        type: "HOUSING" | "ORGANIZATION";
    };
    quantity: number;
};

export type ProductEntry = {
    id: string;
    product_type_id: string;
    product_type: ProductSchema;
    brand: string;
    category: string;
    description: string;
    created_at: string; // ISO Date
    updated_at: string; // ISO Date
    quantity: number;
    from: {
        id: string;
        type: string; // "ORGANIZATION"
    };
    to: {
        id: string;
        type: string; // "ORGANIZATION"
    };
    type: string; // "ENTRANCE"
    organization_id: string;
    organization: OrganizationSchema;
};
