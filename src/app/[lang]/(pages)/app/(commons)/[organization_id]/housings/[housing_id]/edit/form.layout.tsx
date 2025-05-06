"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getHousingById, updateHousing } from "@/repository/housing.repository";
import { HousingSchema } from "@/types/housing.types";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHouseChimneyUser } from "react-icons/fa6";
import { MdError, MdSave } from "react-icons/md";

type Props = {
    housingId: string;
};

const Form = ({ housingId }: Props): ReactNode => {
    const router = useRouter();
    const pathname = usePathname();
    const dict = useDictionary();

    const { toast } = useToast();
    const [data, setData] = useState<HousingSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {
                if (housingId) {
                    const response = await getHousingById(housingId);
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

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const data: {
                name: string;
                addressLine1: string;
                addressLine2: string;
                city: string;
                postalCode: string;
                state: string;
                country: string;
            } = Object.fromEntries(formData);

            await updateHousing(housingId, {
                name: data.name,
                address: {
                    address_line_1: data.addressLine1,
                    address_line_2: data.addressLine2,
                    city: data.city,
                    district: data.state,
                    zip_code: data.postalCode,
                    country: data.country,
                },
            });

            toast({
                title: dict.housingOverview.editHousing.toastSuccessTitle,
                description: dict.housingOverview.editHousing.toastSuccessDescription,
                variant: "success",
            });

            const organizationId = pathname.split("/")[3];
            router.push(`/app/${organizationId}/housings/${housingId}`);
        } catch {
            setIsLoading(false);
            toast({
                title: dict.housingOverview.editHousing.toastErrorTitle,
                description: dict.housingOverview.editHousing.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                {dict.housingOverview.editHousing.loading}
            </h2>
        );

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.housingOverview.editHousing.error}
            </span>
        );

    if (data) {
        return (
            <form className="w-full h-max flex flex-col gap-6" onSubmit={handleSubmit}>
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaHouseChimneyUser />
                    {dict.housingOverview.editHousing.title}
                </h1>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="name">{dict.housingOverview.editHousing.name} *</Label>
                    <Input id="name" name="name" type="text" defaultValue={data.name} required />
                </div>

                <div className="w-full h-max flex flex-col gap-6 p-4 border border-dashed border-relif-orange-200 rounded-lg">
                    <h2 className="text-relif-orange-200 font-bold flex items-center gap-2">
                        <FaMapMarkerAlt /> {dict.housingOverview.editHousing.address}
                    </h2>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="addressLine1">
                            {dict.housingOverview.editHousing.addressLine} 1 *
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
                            {dict.housingOverview.editHousing.addressLine} 2
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
                            <Label htmlFor="city">{dict.housingOverview.editHousing.city} *</Label>
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
                                {dict.housingOverview.editHousing.zipCode} *
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
                                {dict.housingOverview.editHousing.state} *
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
                                {dict.housingOverview.editHousing.country} *
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

                <Button className="flex items-center gap-2">
                    <MdSave size={16} />
                    {dict.housingOverview.editHousing.btnEdit}
                </Button>
            </form>
        );
    }

    return <div />;
};

export { Form };
