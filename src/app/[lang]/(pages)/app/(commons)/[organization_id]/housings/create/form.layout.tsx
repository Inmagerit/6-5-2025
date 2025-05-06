"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "@/repository/auth.repository";
import { createHousing } from "@/repository/housing.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { IoMdAlert } from "react-icons/io";
import { MdAdd } from "react-icons/md";

const Form = (): ReactNode => {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const dict = useDictionary();

    const urlPath = pathname.split("/").slice(0, 5).join("/");

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

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

            const { data: responseData } = await createHousing({
                name: data.name,
                address: {
                    address_line_1: data.addressLine1,
                    address_line_2: data.addressLine2,
                    city: data.city,
                    zip_code: data.postalCode,
                    district: data.state,
                    country: data.country,
                },
            });

            const housingId = responseData.id;

            toast({
                title: dict.createHousing.toastSuccessTitle,
                description: dict.createHousing.toastSuccessDescription,
                variant: "success",
            });

            if (currentUser.organization_id) {
                router.push(`${urlPath}/${housingId}`);
            } else {
                router.push("/");
                await signOut();
            }
        } catch {
            setIsLoading(false);
            toast({
                title: dict.createHousing.toastErrorTitle,
                description: dict.createHousing.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <form className="w-full h-max flex flex-col gap-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                <FaHouseChimneyUser />
                {dict.createHousing.title}
            </h1>

            <div className="flex flex-col gap-3">
                <Label htmlFor="name">{dict.createHousing.name} *</Label>
                <Input id="name" name="name" type="text" required />
            </div>

            <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <FaMapMarkerAlt /> {dict.createHousing.address}
                </h2>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="addressLine1">{dict.createHousing.addressLine} 1 *</Label>
                    <Input id="addressLine1" name="addressLine1" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="addressLine2">{dict.createHousing.addressLine} 2</Label>
                    <Input id="addressLine2" name="addressLine2" type="text" />
                </div>

                <div className="w-full flex items-center gap-2">
                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="city">{dict.createHousing.city} *</Label>
                        <Input id="city" name="city" type="text" required />
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="postalCode">{dict.createHousing.zipCode} *</Label>
                        <Input id="postalCode" name="postalCode" type="text" required />
                    </div>
                </div>

                <div className="w-full flex items-center gap-2">
                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="state">{dict.createHousing.state} *</Label>
                        <Input id="state" name="state" type="text" required />
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="country">{dict.createHousing.country} *</Label>
                        <Input id="country" name="country" type="text" required />
                    </div>
                </div>
            </div>

            <Alert>
                <IoMdAlert className="h-4 w-4" />
                <AlertTitle>{dict.createHousing.alertTitle}</AlertTitle>
                <AlertDescription className="text-slate-500">
                    {dict.createHousing.alertDescription}
                </AlertDescription>
            </Alert>

            <Button className="flex items-center gap-2">
                <MdAdd size={16} />
                {!isLoading ? dict.createHousing.btnCreate : dict.createHousing.btnLoading}
            </Button>
        </form>
    );
};

export { Form };
