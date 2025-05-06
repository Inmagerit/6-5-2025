"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createOrganization } from "@/repository/organization.repository";
import { getFromLocalStorage, updateLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaMapMarkerAlt, FaRegBuilding } from "react-icons/fa";

const CreateOrganization = (): ReactNode => {
    const router = useRouter();
    const { toast } = useToast();
    const dict = useDictionary();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                name: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                postalCode: string;
                state: string;
                country: string;
            } = Object.fromEntries(formData);

            const { data: responseData } = await createOrganization({
                name: data.name,
                description: "",
                address: {
                    address_line_1: data.addressLine1,
                    address_line_2: data.addressLine2,
                    city: data.city,
                    zip_code: data.postalCode,
                    district: data.state,
                    country: data.country,
                },
            });

            const organizationID = responseData.id;

            const currentUser = await getFromLocalStorage("r_ud");
            updateLocalStorage("r_ud", {
                ...currentUser,
                platform_role: "ORG_ADMIN",
                organization_id: organizationID,
            });

            router.push(`/app/${organizationID}`);
        } catch {
            setIsLoading(false);
            toast({
                title: dict.createOrganization.toastErrorTitle,
                description: dict.createOrganization.description,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="w-[700px] h-max border border-slate-200 rounded-lg overflow-hidden lg:w-full lg:border-none lg:h-full">
            <h1 className="text-white bg-relif-orange-200 font-bold text-xl flex items-center justify-center w-full border-b-[1px] border-slate-200 p-6 gap-2">
                <FaRegBuilding /> {dict.createOrganization.title}
            </h1>
            <form
                className="flex flex-col gap-6 p-6 pl-8 overflow-x-hidden overflow-y-scroll lg:p-3 max-h-[calc(100vh-300px)]"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col pt-4 gap-2">
                    <Label htmlFor="name">{dict.createOrganization.name} *</Label>
                    <Input id="name" name="name" type="text" required />
                </div>
                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-md">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaMapMarkerAlt /> {dict.createOrganization.address}
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="addressLine1">
                            {dict.createOrganization.addressLine} 1 *
                        </Label>
                        <Input id="addressLine1" name="addressLine1" type="text" required />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="addressLine2">
                            {dict.createOrganization.addressLine} 2
                        </Label>
                        <Input id="addressLine2" name="addressLine2" type="text" />
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="city">{dict.createOrganization.city} *</Label>
                            <Input id="city" name="city" type="text" required />
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="postalCode">{dict.createOrganization.zipCode} *</Label>
                            <Input id="postalCode" name="postalCode" type="text" required />
                        </div>
                    </div>

                    <div className="w-full flex items-center gap-2">
                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="state">{dict.createOrganization.state} *</Label>
                            <Input id="state" name="state" type="text" required />
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Label htmlFor="country">{dict.createOrganization.country} *</Label>
                            <Input id="country" name="country" type="text" required />
                        </div>
                    </div>
                </div>
                <Button type="submit">
                    {!isLoading
                        ? dict.createOrganization.btnCreate
                        : dict.createOrganization.loading}
                </Button>
            </form>
        </div>
    );
};

export { CreateOrganization };
