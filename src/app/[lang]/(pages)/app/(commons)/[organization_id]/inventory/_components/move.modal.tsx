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
import { getStorageRecords, reallocateProduct } from "@/repository/inventory.repository";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { AllocationSchema, ProductSchema } from "@/types/product.types";
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

const MoveProductModal = ({
    product,
    refreshList,
    modalOpenState,
    setModalOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [housings, setHousings] = useState<HousingSchema[] | []>([]);
    const [storageRecords, setStorageRecords] = useState<AllocationSchema[] | []>([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
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
                        const promises = [
                            await findHousingsByOrganizationId(
                                currUser.organization_id,
                                0,
                                9999,
                                ""
                            ),
                            await getStorageRecords(product.id),
                        ];

                        const [housingsResponse, allocationsResponse] = await Promise.all(promises);
                        setHousings(housingsResponse.data.data);
                        setStorageRecords(allocationsResponse.data);
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

    const handleMove = async (): Promise<void> => {
        try {
            if (!from || !to) {
                throw new Error();
            }

            const storageFrom = from.split("_");
            const storageTo = to.split("_");

            await reallocateProduct(product.id, {
                from: {
                    type: storageFrom[0] as "ORGANIZATION" | "HOUSING",
                    id: storageFrom[1],
                },
                to: {
                    type: storageTo[0] as "ORGANIZATION" | "HOUSING",
                    id: storageTo[1],
                },
                quantity,
            });

            refreshList();

            setModalOpenState(false);
            toast({
                title: dict.commons.inventory.move.productMovedSuccessTitle,
                description: dict.commons.inventory.move.productMovedSuccessDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.inventory.move.errorMovingProductTitle,
                description: dict.commons.inventory.move.errorMovingProductDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={modalOpenState} onOpenChange={setModalOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3 text-start">
                        {dict.commons.inventory.move.moveProductTitle}
                    </DialogTitle>
                    <DialogDescription className="text-start">
                        {dict.commons.inventory.move.moveProductDescription}
                    </DialogDescription>

                    {isLoading && (
                        <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                            {dict.commons.inventory.move.loading}
                        </h2>
                    )}

                    {error && (
                        <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                            <MdError />
                            {dict.commons.inventory.move.errorMessage}
                        </span>
                    )}

                    {currentUser && currentUser.organization_id && housings && (
                        <>
                            <div className="flex flex-col gap-6 pt-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        {dict.commons.inventory.move.from}
                                    </Label>
                                    <Select onValueChange={setFrom}>
                                        <SelectTrigger className="w-full" id="locale">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {storageRecords?.map(storage => (
                                                <SelectItem
                                                    key={storage.location.id}
                                                    value={
                                                        storage.location.id ===
                                                        currentUser.organization_id
                                                            ? `ORGANIZATION_${storage.location.id}`
                                                            : `HOUSING_${storage.location.id}`
                                                    }
                                                >
                                                    {storage.location.id ===
                                                    currentUser.organization_id
                                                        ? `Organization (${storage.quantity} ${product.unit_type})`
                                                        : `${storage.location.name} (${storage.quantity} ${product.unit_type})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        {dict.commons.inventory.move.newLocation}
                                    </Label>
                                    <Select onValueChange={setTo}>
                                        <SelectTrigger className="w-full" id="locale">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={`ORGANIZATION_${currentUser.organization_id}`}
                                            >
                                                {dict.commons.inventory.move.organization}
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
                                        {dict.commons.inventory.move.quantity}
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="Quantity"
                                        required
                                        min={0}
                                        defaultValue={0}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-5">
                                <Button variant="outline" onClick={() => setModalOpenState(false)}>
                                    {dict.commons.inventory.move.cancel}
                                </Button>
                                <Button onClick={handleMove}>
                                    {dict.commons.inventory.move.move}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { MoveProductModal };
