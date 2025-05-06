"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { allocateProduct } from "@/repository/inventory.repository";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { ProductSchema } from "@/types/product.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

type Props = {
    product: ProductSchema;
    refreshList: () => void;
    modalOpenState: boolean;
    setModalOpenState: Dispatch<SetStateAction<boolean>>;
};

const InputProductModal = ({
    product,
    refreshList,
    modalOpenState,
    setModalOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [housings, setHousings] = useState<HousingSchema[] | []>([]);
    const [quantity, setQuantity] = useState<number>(0);
    const [selectedStorage, setSelectedStorage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                if (modalOpenState) {
                    const currUser: UserSchema = await getFromLocalStorage("r_ud");
                    setCurrentUser(currUser);
                    if (currUser && currUser.organization_id) {
                        const { data: housingResponse } = await findHousingsByOrganizationId(
                            currUser.organization_id,
                            0,
                            9999,
                            ""
                        );
                        setHousings(housingResponse.data);
                    } else {
                        throw new Error();
                    }
                }
            } catch (err) {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [modalOpenState]);

    const handleAdd = async (): Promise<void> => {
        try {
            if (!selectedStorage) {
                throw new Error();
            }

            const [storageType, storageId] = selectedStorage.split("_");

            await allocateProduct(product.id, {
                to: {
                    type: storageType as "ORGANIZATION" | "HOUSING",
                    id: storageId,
                },
                quantity,
            });

            refreshList();

            setModalOpenState(false);
            toast({
                title: dict.commons.inventory.input.productAddedSuccessTitle,
                description: dict.commons.inventory.input.productAddedSuccessDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.inventory.input.errorAddingProductTitle,
                description: dict.commons.inventory.input.errorAddingProductDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={modalOpenState} onOpenChange={setModalOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3 text-start">
                        {dict.commons.inventory.input.addProductTitle}
                    </DialogTitle>
                    <DialogDescription className="text-start">
                        {dict.commons.inventory.input.addProductDescription}
                    </DialogDescription>

                    {isLoading && (
                        <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                            {dict.commons.inventory.input.loading}
                        </h2>
                    )}

                    {error && (
                        <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                            <MdError />
                            {dict.commons.inventory.input.errorMessage}
                        </span>
                    )}

                    {currentUser && currentUser.organization_id && housings && (
                        <>
                            <div className="flex flex-col gap-6 pt-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        {dict.commons.inventory.input.whereProduct}
                                    </Label>
                                    <Select onValueChange={setSelectedStorage}>
                                        <SelectTrigger className="w-full" id="locale">
                                            <SelectValue
                                                placeholder={dict.commons.inventory.input.select}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={`ORGANIZATION_${currentUser.organization_id}`}
                                            >
                                                {dict.commons.inventory.input.organization}
                                            </SelectItem>
                                            {housings?.map((housing: HousingSchema) => (
                                                <SelectItem
                                                    key={housing.id}
                                                    value={`HOUSING_${housing.id}`}
                                                >
                                                    {housing.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        {dict.commons.inventory.input.quantity}
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min={0}
                                        required
                                        defaultValue={0}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-5">
                                <Button variant="outline" onClick={() => setModalOpenState(false)}>
                                    {dict.commons.inventory.input.cancel}
                                </Button>
                                <Button onClick={handleAdd}>
                                    {dict.commons.inventory.input.save}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { InputProductModal };
