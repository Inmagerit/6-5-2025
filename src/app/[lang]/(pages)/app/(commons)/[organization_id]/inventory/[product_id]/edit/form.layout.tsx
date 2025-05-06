"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getProductById, updateProduct } from "@/repository/inventory.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaBoxes } from "react-icons/fa";
import { MdAdd, MdError } from "react-icons/md";

type Props = {
    productId: string;
};

const Form = ({ productId }: Props): ReactNode => {
    const router = useRouter();
    const dict = useDictionary();

    const { toast } = useToast();
    const [product, setProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        (async () => {
            try {
                if (productId) {
                    const response = await getProductById(productId);
                    setProduct(response.data);
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
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            if (productId) {
                // @ts-ignore
                const data: {
                    name: string;
                    description: string;
                    brand: string;
                    unitType: string;
                    category: string;
                } = Object.fromEntries(formData);

                await updateProduct(productId, {
                    name: data.name,
                    description: data.description,
                    brand: data.brand,
                    category: data.category,
                    unit_type: data.unitType,
                });

                toast({
                    title: dict.commons.inventory.edit.successToastTitle,
                    description: dict.commons.inventory.edit.successToastDescription,
                    variant: "success",
                });

                router.push(`/app/${currentUser.organization_id}/inventory`);
            } else {
                throw new Error();
            }
        } catch {
            setIsLoading(false);
            toast({
                title: dict.commons.inventory.edit.errorToastTitle,
                description: dict.commons.inventory.edit.errorToastDescription,
                variant: "destructive",
            });
        }
    };

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                {dict.commons.inventory.edit.loading}
            </h2>
        );

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.commons.inventory.edit.errorEditing}
            </span>
        );

    if (product) {
        return (
            <form
                className="w-full h-[calc(100vh-83px)] p-4 grid grid-cols-2 lg:flex lg:flex-col overflow-x-hidden overflow-y-scroll"
                onSubmit={handleSubmit}
            >
                <div className="flex flex-col gap-6">
                    <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                        <FaBoxes />
                        {dict.commons.inventory.edit.title}
                    </h1>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="name">{dict.commons.inventory.edit.name}</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            defaultValue={product?.name}
                        />
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        <Label htmlFor="description">
                            {dict.commons.inventory.edit.description}
                        </Label>
                        <textarea
                            className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="description"
                            name="description"
                            defaultValue={product?.description}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="brand">{dict.commons.inventory.edit.brand}</Label>
                        <Input
                            id="brand"
                            name="brand"
                            type="text"
                            required
                            defaultValue={product?.brand}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="unitType">{dict.commons.inventory.edit.unitType}</Label>
                        <Select name="unitType" defaultValue={product?.unit_type}>
                            <SelectTrigger className="w-full" id="unitType">
                                <SelectValue
                                    placeholder={dict.commons.inventory.edit.selectPlaceholder}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="un">
                                    {dict.commons.inventory.edit.unitOptions.un}
                                </SelectItem>
                                <SelectItem value="kg">
                                    {dict.commons.inventory.edit.unitOptions.kg}
                                </SelectItem>
                                <SelectItem value="g">
                                    {dict.commons.inventory.edit.unitOptions.g}
                                </SelectItem>
                                <SelectItem value="dz">
                                    {dict.commons.inventory.edit.unitOptions.dz}
                                </SelectItem>
                                <SelectItem value="box">
                                    {dict.commons.inventory.edit.unitOptions.box}
                                </SelectItem>
                                <SelectItem value="liters">
                                    {dict.commons.inventory.edit.unitOptions.liters}
                                </SelectItem>
                                <SelectItem value="others">
                                    {dict.commons.inventory.edit.unitOptions.others}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label htmlFor="category">{dict.commons.inventory.edit.category}</Label>
                        <Select name="category" defaultValue={product?.category}>
                            <SelectTrigger className="w-full" id="category">
                                <SelectValue
                                    placeholder={dict.commons.inventory.edit.selectPlaceholder}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="foodAndBeverages">
                                    {dict.commons.inventory.edit.categoryOptions.foodAndBeverages}
                                </SelectItem>
                                <SelectItem value="personalCareAndBeauty">
                                    {
                                        dict.commons.inventory.edit.categoryOptions
                                            .personalCareAndBeauty
                                    }
                                </SelectItem>
                                <SelectItem value="householdCleaning">
                                    {dict.commons.inventory.edit.categoryOptions.householdCleaning}
                                </SelectItem>
                                <SelectItem value="babyCareProducts">
                                    {dict.commons.inventory.edit.categoryOptions.babyCareProducts}
                                </SelectItem>
                                <SelectItem value="petProducts">
                                    {dict.commons.inventory.edit.categoryOptions.petProducts}
                                </SelectItem>
                                <SelectItem value="pharmacyAndMedications">
                                    {
                                        dict.commons.inventory.edit.categoryOptions
                                            .pharmacyAndMedications
                                    }
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="flex items-center gap-2" type="submit">
                        <MdAdd size={16} />
                        {dict.commons.inventory.edit.update}
                    </Button>
                </div>
            </form>
        );
    }

    return <div />;
};

export { Form };
