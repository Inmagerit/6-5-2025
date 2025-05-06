import { ProductSchema } from "@/types/product.types";

import {
    AddressSchema,
    DocumentSchema,
    EmergencyContactSchema,
    MedicalInformationSchema,
} from "./commons.types";
import { HousingSchema } from "./housing.types";
import { SpaceSchema } from "./space.types";

export type BeneficiarySchema = {
    id: string;
    image_url: string;
    full_name: string;
    email: string;
    documents: DocumentSchema[];
    birthdate: string;
    gender: string;
    occupation: string;
    phones: string[];
    civil_status: string;
    spoken_languages: string[];
    education: string;
    address: AddressSchema;
    status: string;
    current_housing: HousingSchema;
    current_housing_id: string;
    current_room: SpaceSchema;
    current_room_id: string;
    medical_information: MedicalInformationSchema;
    emergency_contacts: EmergencyContactSchema[];
    created_at: string;
    updated_at: string;
    notes: string;
};

export type BeneficiaryAllocationSchema = {
    id: string;
    beneficiary_id: string;
    old_housing: HousingSchema;
    old_housing_id: string;
    old_room: SpaceSchema;
    old_room_id: string;
    housing: HousingSchema;
    housing_id: string;
    room: SpaceSchema;
    room_id: string;
    type: string;
    auditor_id: string;
    created_at: string;
    exit_date: string;
    exit_reason: string;
};

export type DonateProductToBeneficiaryRequest = {
    from: {
        type: "ORGANIZATION" | "HOUSING";
        id: string;
    };
    product_type_id: string;
    quantity: number;
};

export type Donation = {
    id: string;
    organization_id: string;
    beneficiary_id: string;
    beneficiary: BeneficiarySchema;
    from: {
        type: "ORGANIZATION" | "HOUSING";
        name: string;
        id: string;
    };
    product_type_id: string;
    product_type: ProductSchema;
    quantity: number;
    created_at: string;
};

export type CreateBeneficiaryRequest = Omit<
    BeneficiarySchema,
    | "id"
    | "status"
    | "current_housing_id"
    | "current_housing"
    | "current_room_id"
    | "current_room"
    | "created_at"
    | "updated_at"
>;

export type UpdateBeneficiaryRequest = Omit<
    BeneficiarySchema,
    | "id"
    | "status"
    | "current_housing_id"
    | "current_housing"
    | "current_room_id"
    | "current_room"
    | "created_at"
    | "updated_at"
>;
