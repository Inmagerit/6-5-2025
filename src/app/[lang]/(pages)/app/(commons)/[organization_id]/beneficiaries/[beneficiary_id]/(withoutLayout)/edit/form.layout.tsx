"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
    generateProfileImageUploadLink,
    getBeneficiaryById,
    updateBeneficiary,
} from "@/repository/beneficiary.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { MdContacts, MdError, MdSave } from "react-icons/md";

import { CivilStatus } from "./civilStatus.layout";
import { Education } from "./education.layout";
import { Gender } from "./gender.layout";
import { Medical } from "./medical.layout";
import { RelationshipDegree } from "./relationship.layout";

type Props = {
    beneficiaryId: string;
};

const Form = ({ beneficiaryId }: Props): ReactNode => {
    const router = useRouter();
    const dict = useDictionary();
    const { toast } = useToast();

    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const [data, setData] = useState<BeneficiarySchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [languages, setLanguages] = useState<string[] | []>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {
                if (beneficiaryId) {
                    const response = await getBeneficiaryById(beneficiaryId);
                    setData(response.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                {dict.commons.beneficiaries.edit.loading}
            </h2>
        );

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.commons.beneficiaries.edit.somethingWentWrong}
            </span>
        );

    const handleInputChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            const { data } = await generateProfileImageUploadLink(file.type);

            await fetch(data.link, {
                method: "PUT",
                headers: {
                    "Content-Type": file.type,
                },
                body: file,
            });

            const s3Link = data.link.split("?")[0];
            setImageUrl(s3Link);

            toast({
                title: "Upload Successful",
                description: "The image has been uploaded successfully.",
                variant: "success",
            });
        } catch (err) {
            setIsUploading(false);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading the image.",
                variant: "destructive",
            });
        }
    };

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const fData: {
                fullName: string;
                birthdate: string;
                email: string;
                gender: string;
                otherGender: string;
                civilStatus: string;
                otherCivilStatus: string;
                education: string;
                otherEducation: string;
                occupation: string;
                documentType: string;
                documentValue: string;
                countryCode: string;
                phone: string;
                languages: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                postalCode: string;
                state: string;
                country: string;
                allergies: string;
                currentMedications: string;
                chronicMedicalConditions: string;
                healthInsurance: string;
                bloodType: string;
                vaccinations: string;
                mentalHealth: string;
                height: number;
                weight: number;
                addictions: string;
                disabilities: string;
                prothesisOrMedicalDevices: string;
                notes: string;
                emergencyName: string;
                emergencyRelationship: string;
                otherEmergencyRelationship: string;
                emergencyContryCode: string;
                emergencyPhone: string;
                emergencyEmail: string;
            } = Object.fromEntries(formData);

            await updateBeneficiary(beneficiaryId, {
                full_name: fData.fullName,
                image_url: imageUrl || "",
                birthdate: fData.birthdate,
                email: fData.email,
                gender: fData.gender === "other" ? fData.otherGender : fData.gender,
                civil_status:
                    fData.civilStatus === "other" ? fData.otherCivilStatus : fData.civilStatus,
                education: fData.education === "other" ? fData.otherEducation : fData.education,
                occupation: fData.occupation,
                spoken_languages: fData.languages.split(","),
                phones: [`${fData.countryCode}_${fData.phone}`],
                address: {
                    address_line_1: fData.addressLine1,
                    address_line_2: fData.addressLine2,
                    city: fData.city,
                    district: fData.state,
                    zip_code: fData.postalCode,
                    country: fData.country,
                },
                medical_information: {
                    allergies: fData.allergies.split(","),
                    current_medications: fData.currentMedications.split(","),
                    recurrent_medical_conditions: fData.chronicMedicalConditions.split(","),
                    health_insurance_plans: fData.healthInsurance.split(","),
                    blood_type: fData.bloodType,
                    taken_vaccines: fData.vaccinations.split(","),
                    mental_health_history: fData.mentalHealth.split(","),
                    height: Number(fData.height),
                    weight: Number(fData.weight),
                    addictions: fData.addictions.split(","),
                    disabilities: fData.disabilities.split(","),
                    prothesis_or_medical_devices: fData.prothesisOrMedicalDevices.split(","),
                },
                notes: fData.notes,
                documents: [
                    {
                        type: fData.documentType,
                        value: fData.documentValue,
                    },
                ],
                emergency_contacts: [
                    {
                        phones: [`${fData.emergencyContryCode}_${fData.emergencyPhone}`],
                        emails: [fData.emergencyEmail],
                        full_name: fData.emergencyName,
                        relationship:
                            fData.emergencyRelationship === "other"
                                ? fData.otherEmergencyRelationship
                                : fData.emergencyRelationship,
                    },
                ],
            });

            toast({
                title: dict.commons.beneficiaries.edit.toastSuccessTitle,
                description: dict.commons.beneficiaries.edit.toastSuccessDescription,
                variant: "success",
            });

            router.push(urlPath);
        } catch (err) {
            toast({
                title: dict.commons.beneficiaries.edit.toastErrorTitle,
                description: dict.commons.beneficiaries.edit.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    if (data) {
        return (
            <form
                className="w-full h-max p-4 grid grid-cols-2 gap-4 lg:flex lg:flex-col"
                onSubmit={handleSubmit}
            >
                <div className="w-full h-max flex flex-col gap-6">
                    <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                        <FaUsers />
                        {dict.commons.beneficiaries.edit.title}
                    </h1>

                    <div className="flex flex-col gap-3 border border-slate-200 p-4 rounded-lg">
                        <Label htmlFor="picture">Picture</Label>
                        <Input id="picture" type="file" onChange={handleImageUpload} />
                        {isUploading && <p>Uploading image...</p>}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="fullName">
                            {dict.commons.beneficiaries.edit.fullName} *
                        </Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            defaultValue={data.full_name}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="birthdate">
                            {dict.commons.beneficiaries.edit.birthdate} *
                        </Label>
                        <input
                            id="birthdate"
                            name="birthdate"
                            type="date"
                            className="w-full px-3 py-2 border rounded-md text-sm text-slate-900 placeholder-slate-400 border-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-relif-orange-200"
                            required
                            defaultValue={data.birthdate}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="document">
                            {dict.commons.beneficiaries.edit.document} *
                        </Label>
                        <div className="w-full flex gap-2">
                            <Input
                                id="documentType"
                                name="documentType"
                                type="text"
                                placeholder={
                                    dict.commons.beneficiaries.edit.documentTypePlaceholder
                                }
                                className="w-[50%]"
                                required
                                defaultValue={data.documents[0].type}
                            />
                            <Input
                                id="documentValue"
                                name="documentValue"
                                type="text"
                                className="w-[50%]"
                                placeholder={
                                    dict.commons.beneficiaries.edit.documentValuePlaceholder
                                }
                                required
                                defaultValue={data.documents[0].value}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">{dict.commons.beneficiaries.edit.email} *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            defaultValue={data.email}
                        />
                    </div>

                    <Gender defaultValue={data.gender} />

                    <CivilStatus defaultValue={data.civil_status} />

                    <Education defaultValue={data.education} />

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="occupation">
                            {dict.commons.beneficiaries.edit.occupation} *
                        </Label>
                        <Input
                            id="occupation"
                            name="occupation"
                            type="text"
                            required
                            defaultValue={data.occupation}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="phone">{dict.commons.beneficiaries.edit.phone} *</Label>
                        <div className="w-full flex gap-2">
                            <Input
                                id="countryCode"
                                name="countryCode"
                                type="text"
                                placeholder={dict.commons.beneficiaries.edit.countryCodePlaceholder}
                                className="w-[30%]"
                                required
                                defaultValue={data.phones[0].split("_")[0]}
                            />
                            <Input
                                id="phone"
                                name="phone"
                                type="text"
                                required
                                defaultValue={data.phones[0].split("_")[1]}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="languages">
                            {dict.commons.beneficiaries.edit.languages} *
                        </Label>
                        <Input
                            id="languages"
                            name="languages"
                            type="text"
                            placeholder={dict.commons.beneficiaries.edit.languagesPlaceholder}
                            onChange={handleInputChange(setLanguages)}
                            required
                            defaultValue={data.spoken_languages.join(",")}
                        />
                        <div className="flex flex-wrap items-center gap-1 mt-[-6px]">
                            {languages?.map((language, index) => (
                                <Badge variant="outline" key={index}>
                                    {language}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaMapMarkerAlt /> {dict.commons.beneficiaries.edit.lastAddress}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="addressLine1">
                                {dict.commons.beneficiaries.edit.addressLine} 1 *
                            </Label>
                            <Input
                                id="addressLine1"
                                name="addressLine1"
                                type="text"
                                required
                                defaultValue={data.address.address_line_1}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="addressLine2">
                                {dict.commons.beneficiaries.edit.addressLine} 2
                            </Label>
                            <Input
                                id="addressLine2"
                                name="addressLine2"
                                type="text"
                                defaultValue={data.address.address_line_2}
                            />
                        </div>

                        <div className="w-full flex items-center gap-2">
                            <div className="flex flex-col gap-3 w-full">
                                <Label htmlFor="city">
                                    {dict.commons.beneficiaries.edit.city} *
                                </Label>
                                <Input
                                    id="city"
                                    name="city"
                                    type="text"
                                    required
                                    defaultValue={data.address.city}
                                />
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <Label htmlFor="postalCode">
                                    {dict.commons.beneficiaries.edit.postalCode} *
                                </Label>
                                <Input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    required
                                    defaultValue={data.address.zip_code}
                                />
                            </div>
                        </div>

                        <div className="w-full flex items-center gap-2">
                            <div className="flex flex-col gap-3 w-full">
                                <Label htmlFor="state">
                                    {dict.commons.beneficiaries.edit.state} *
                                </Label>
                                <Input
                                    id="state"
                                    name="state"
                                    type="text"
                                    required
                                    defaultValue={data.address.district}
                                />
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                <Label htmlFor="country">
                                    {dict.commons.beneficiaries.edit.country} *
                                </Label>
                                <Input
                                    id="country"
                                    name="country"
                                    type="text"
                                    required
                                    defaultValue={data.address.country}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                        <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <MdContacts /> {dict.commons.beneficiaries.edit.emergencyContact}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="emergencyName">
                                {dict.commons.beneficiaries.edit.emergencyName} *
                            </Label>
                            <Input
                                id="emergencyName"
                                name="emergencyName"
                                type="text"
                                required
                                defaultValue={data.emergency_contacts[0].full_name}
                            />
                        </div>

                        <RelationshipDegree
                            defaultValue={data.emergency_contacts[0].relationship}
                        />

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="emergencyPhone">
                                {dict.commons.beneficiaries.edit.emergencyPhone} *
                            </Label>
                            <div className="w-full flex gap-2">
                                <Input
                                    id="emergencyCountryCode"
                                    name="emergencyCountryCode"
                                    type="text"
                                    placeholder="e.g. +55"
                                    className="w-[30%]"
                                    required
                                    defaultValue={
                                        data.emergency_contacts[0].phones[0].split("_")[0]
                                    }
                                />
                                <Input
                                    id="emergencyPhone"
                                    name="emergencyPhone"
                                    type="text"
                                    required
                                    defaultValue={
                                        data.emergency_contacts[0].phones[0].split("_")[1]
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="emergencyEmail">
                                {dict.commons.beneficiaries.edit.emergencyEmail} *
                            </Label>
                            <Input
                                id="emergencyEmail"
                                name="emergencyEmail"
                                type="text"
                                defaultValue={data.emergency_contacts[0].emails[0]}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <Medical defaultValue={data.medical_information} />

                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="notes">{dict.commons.beneficiaries.edit.notes}</Label>
                        <textarea
                            className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="notes"
                            name="notes"
                            defaultValue={data.notes}
                        />
                    </div>

                    <Button className="flex items-center gap-2">
                        <MdSave size={16} />
                        {dict.commons.beneficiaries.edit.updateBeneficiaryButton}
                    </Button>
                </div>
            </form>
        );
    }

    return <div />;
};

export { Form };
