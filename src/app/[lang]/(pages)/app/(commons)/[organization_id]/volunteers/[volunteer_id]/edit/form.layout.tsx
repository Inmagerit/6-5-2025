"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getVolunteerById, updateVolunteer } from "@/repository/volunteer.repository";
import { VoluntarySchema } from "@/types/voluntary.types";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { MdContacts, MdError, MdSave } from "react-icons/md";

import { Gender } from "./gender.layout";
import { Medical } from "./medical.layout";
import { RelationshipDegree } from "./relationship.layout";

type Props = {
    volunteerId: string;
};

const Form = ({ volunteerId }: Props): ReactNode => {
    const router = useRouter();
    const dict = useDictionary();
    const pathname = usePathname();
    const { toast } = useToast();

    const [data, setData] = useState<VoluntarySchema | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [languages, setLanguages] = useState<string[] | []>([]);

    const urlPath = pathname.split("/").slice(0, 5).join("/");

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {
                if (volunteerId) {
                    const response = await getVolunteerById(volunteerId);
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
                {dict.commons.volunteers.volunteerId.edit.loading}
            </h2>
        );

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.commons.volunteers.volunteerId.edit.error}
            </span>
        );

    const handleInputChange =
        (setter: Dispatch<SetStateAction<string[]>>) => (event: ChangeEvent<HTMLInputElement>) => {
            const values = event.target.value.split(",").map(value => value.trim());
            setter(values);
        };

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const data: {
                fullName: string;
                birthdate: string;
                email: string;
                gender: string;
                otherGender: string;
                documentType: string;
                documentValue: string;
                countryCode: string;
                phone: string;
                segments: string;
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
                emergencyCountryCode: string;
                emergencyPhone: string;
                emergencyEmail: string;
            } = Object.fromEntries(formData);

            await updateVolunteer(volunteerId, {
                full_name: data.fullName,
                birthdate: data.birthdate,
                email: data.email,
                gender: data.gender === "other" ? data.otherGender : data.gender,
                segments: data.segments.split(","),
                phones: [`${data.countryCode}_${data.phone}`],
                address: {
                    address_line_1: data.addressLine1,
                    address_line_2: data.addressLine2,
                    city: data.city,
                    district: data.state,
                    zip_code: data.postalCode,
                    country: data.country,
                },
                medical_information: {
                    allergies: data.allergies.split(","),
                    current_medications: data.currentMedications.split(","),
                    recurrent_medical_conditions: data.chronicMedicalConditions.split(","),
                    health_insurance_plans: data.healthInsurance.split(","),
                    blood_type: data.bloodType,
                    taken_vaccines: data.vaccinations.split(","),
                    mental_health_history: data.mentalHealth.split(","),
                    height: Number(data.height),
                    weight: Number(data.weight),
                    addictions: data.addictions.split(","),
                    disabilities: data.disabilities.split(","),
                    prothesis_or_medical_devices: data.prothesisOrMedicalDevices.split(","),
                },
                notes: data.notes,
                documents: [
                    {
                        type: data.documentType,
                        value: data.documentValue,
                    },
                ],
                emergency_contacts: [
                    {
                        phones: [`${data.emergencyCountryCode}_${data.emergencyPhone}`],
                        emails: [data.emergencyEmail],
                        full_name: data.emergencyName,
                        relationship:
                            data.emergencyRelationship === "other"
                                ? data.otherEmergencyRelationship
                                : data.emergencyRelationship,
                    },
                ],
            });

            toast({
                title: dict.commons.volunteers.volunteerId.edit.updateSuccessful,
                description: dict.commons.volunteers.volunteerId.edit.volunteerUpdatedSuccessfully,
                variant: "success",
            });

            router.push(urlPath);
        } catch (err) {
            toast({
                title: dict.commons.volunteers.volunteerId.edit.updateError,
                description: dict.commons.volunteers.volunteerId.edit.updateErrorDescription,
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
                        {dict.commons.volunteers.volunteerId.edit.editVolunteer}
                    </h1>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="fullName">
                            {dict.commons.volunteers.volunteerId.edit.fullName} *
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
                            {dict.commons.volunteers.volunteerId.edit.birthdate} *
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
                            {dict.commons.volunteers.volunteerId.edit.document} *
                        </Label>
                        <div className="w-full flex gap-2">
                            <Input
                                id="documentType"
                                name="documentType"
                                type="text"
                                placeholder={
                                    dict.commons.volunteers.volunteerId.edit.documentTypePlaceholder
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
                                    dict.commons.volunteers.volunteerId.edit
                                        .documentValuePlaceholder
                                }
                                required
                                defaultValue={data.documents[0].value}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="email">
                            {dict.commons.volunteers.volunteerId.edit.email} *
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            defaultValue={data.email}
                        />
                    </div>

                    <Gender defaultValue={data.gender} />

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="phone">
                            {dict.commons.volunteers.volunteerId.edit.phone} *
                        </Label>
                        <div className="w-full flex gap-2">
                            <Input
                                id="countryCode"
                                name="countryCode"
                                type="text"
                                placeholder={
                                    dict.commons.volunteers.volunteerId.edit.countryCodePlaceholder
                                }
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
                        <Label htmlFor="segments">
                            {dict.commons.volunteers.volunteerId.edit.segments} *
                        </Label>
                        <Input
                            id="segments"
                            name="segments"
                            type="text"
                            placeholder={
                                dict.commons.volunteers.volunteerId.edit.segmentsPlaceholder
                            }
                            onChange={handleInputChange(setLanguages)}
                            required
                            defaultValue={data.segments.join(",")}
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
                            <FaMapMarkerAlt />{" "}
                            {dict.commons.volunteers.volunteerId.edit.lastAddress}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="addressLine1">
                                {dict.commons.volunteers.volunteerId.edit.addressLine} 1 *
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
                                {dict.commons.volunteers.volunteerId.edit.addressLine} 2
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
                                    {dict.commons.volunteers.volunteerId.edit.city} *
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
                                    {dict.commons.volunteers.volunteerId.edit.postalCode} *
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
                                    {dict.commons.volunteers.volunteerId.edit.state} *
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
                                    {dict.commons.volunteers.volunteerId.edit.country} *
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
                            <MdContacts />{" "}
                            {dict.commons.volunteers.volunteerId.edit.emergencyContact}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <Label htmlFor="emergencyName">
                                {dict.commons.volunteers.volunteerId.edit.emergencyName} *
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
                                {dict.commons.volunteers.volunteerId.edit.emergencyPhone} *
                            </Label>
                            <div className="w-full flex gap-2">
                                <Input
                                    id="emergencyCountryCode"
                                    name="emergencyCountryCode"
                                    type="text"
                                    placeholder={
                                        dict.commons.volunteers.volunteerId.edit
                                            .countryCodePlaceholder
                                    }
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
                                {dict.commons.volunteers.volunteerId.edit.emergencyEmail} *
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
                        <Label htmlFor="notes">
                            {dict.commons.volunteers.volunteerId.edit.notes}
                        </Label>
                        <textarea
                            className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="notes"
                            name="notes"
                            defaultValue={data.notes}
                        />
                    </div>

                    <Button className="flex items-center gap-2">
                        <MdSave size={16} />
                        {dict.commons.volunteers.volunteerId.edit.updateVolunteer}
                    </Button>
                </div>
            </form>
        );
    }

    return <div />;
};

export { Form };
