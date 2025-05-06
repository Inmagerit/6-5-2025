import {
    AddressSchema,
    DocumentSchema,
    EmergencyContactSchema,
    MedicalInformationSchema,
} from "./commons.types";

export type VoluntarySchema = {
    id: string;
    organization_id: string;
    full_name: string;
    email: string;
    gender: string;
    documents: DocumentSchema[];
    birthdate: string;
    phones: string[];
    address: AddressSchema;
    status: string;
    segments: string[];
    medical_information: MedicalInformationSchema;
    emergency_contacts: EmergencyContactSchema[];
    created_at: string;
    updated_at: string;
    notes: string;
};

export type CreateVoluntaryRequest = Omit<
    VoluntarySchema,
    "id" | "organization_id" | "status" | "created_at" | "updated_at"
>;

export type UpdateVoluntaryRequest = Omit<
    VoluntarySchema,
    "id" | "organization_id" | "status" | "created_at" | "updated_at"
>;
