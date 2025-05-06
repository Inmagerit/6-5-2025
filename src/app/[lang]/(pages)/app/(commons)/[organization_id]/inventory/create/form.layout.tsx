"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { createProduct } from "@/repository/organization.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaBoxes } from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import { MdAdd } from "react-icons/md";

const Form = (): ReactNode => {
    const router = useRouter();
    const dict = useDictionary();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);
            const currentUser: UserSchema = await getFromLocalStorage("r_ud");

            if (currentUser && currentUser.organization_id) {
                // @ts-ignore
                const data: {
                    name: string;
                    description: string;
                    brand: string;
                    unitType: string;
                    category: string;
                } = Object.fromEntries(formData);

                await createProduct(currentUser.organization_id, {
                    name: data.name,
                    description: data.description,
                    brand: data.brand,
                    category: data.category,
                    unit_type: data.unitType,
                });

                toast({
                    title: dict.commons.inventory.create.productCreatedSuccessTitle,
                    description: dict.commons.inventory.create.productCreatedSuccessDescription,
                    variant: "success",
                });

                router.push(`/app/${currentUser.organization_id}/inventory`);
            } else {
                throw new Error();
            }
        } catch {
            setIsLoading(false);
            toast({
                title: dict.commons.inventory.create.errorCreatingProductTitle,
                description: dict.commons.inventory.create.errorCreatingProductDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <form
            className="w-full h-[calc(100vh-83px)] p-4 grid grid-cols-2 lg:flex lg:flex-col overflow-x-hidden overflow-y-scroll"
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-6">
                <h1 className="text-2xl text-slate-900 font-bold flex items-center gap-3">
                    <FaBoxes />
                    {dict.commons.inventory.create.createNewProduct}
                </h1>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="name">{dict.commons.inventory.create.name}</Label>
                    <Input id="name" name="name" type="text" required />
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <Label htmlFor="description">{dict.commons.inventory.create.description}</Label>
                    <textarea
                        className="flex min-h-32 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        id="description"
                        name="description"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="brand">{dict.commons.inventory.create.brand}</Label>
                    <Input id="brand" name="brand" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="unitType">{dict.commons.inventory.create.unitType}</Label>
                    <Select name="unitType" required>
                        <SelectTrigger className="w-full" id="unitType">
                            <SelectValue placeholder={dict.commons.inventory.create.select} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="un">
                                {dict.commons.inventory.create.unitTypeOptions.un}
                            </SelectItem>
                            <SelectItem value="kg">
                                {dict.commons.inventory.create.unitTypeOptions.kg}
                            </SelectItem>
                            <SelectItem value="g">
                                {dict.commons.inventory.create.unitTypeOptions.g}
                            </SelectItem>
                            <SelectItem value="dz">
                                {dict.commons.inventory.create.unitTypeOptions.dz}
                            </SelectItem>
                            <SelectItem value="box">
                                {dict.commons.inventory.create.unitTypeOptions.box}
                            </SelectItem>
                            <SelectItem value="liters">
                                {dict.commons.inventory.create.unitTypeOptions.liters}
                            </SelectItem>
                            <SelectItem value="other">
                                {dict.commons.inventory.create.unitTypeOptions.other}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="category">{dict.commons.inventory.create.category}</Label>
                    <Select name="category" required>
                        <SelectTrigger className="w-full" id="category">
                            <SelectValue placeholder={dict.commons.inventory.create.select} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="foodAndBeverages">
                                {dict.commons.inventory.create.categoryOptions.foodAndBeverages}
                            </SelectItem>
                            <SelectItem value="personalCareAndBeauty">
                                {
                                    dict.commons.inventory.create.categoryOptions
                                        .personalCareAndBeauty
                                }
                            </SelectItem>
                            <SelectItem value="householdCleaning">
                                {dict.commons.inventory.create.categoryOptions.householdCleaning}
                            </SelectItem>
                            <SelectItem value="babyCareProducts">
                                {dict.commons.inventory.create.categoryOptions.babyCareProducts}
                            </SelectItem>
                            <SelectItem value="petProducts">
                                {dict.commons.inventory.create.categoryOptions.petProducts}
                            </SelectItem>
                            <SelectItem value="pharmacyAndMedications">
                                {
                                    dict.commons.inventory.create.categoryOptions
                                        .pharmacyAndMedications
                                }
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Alert>
                    <IoMdAlert className="h-4 w-4" />
                    <AlertTitle>{dict.commons.inventory.create.alertTitle}</AlertTitle>
                    <AlertDescription className="text-slate-500">
                        {dict.commons.inventory.create.alertDescription}
                    </AlertDescription>
                </Alert>

                <Button className="flex items-center gap-2" type="submit">
                    <MdAdd size={16} />
                    {!isLoading
                        ? dict.commons.inventory.create.create
                        : dict.commons.inventory.create.loading}
                </Button>
            </div>
        </form>
    );
};

export { Form };
