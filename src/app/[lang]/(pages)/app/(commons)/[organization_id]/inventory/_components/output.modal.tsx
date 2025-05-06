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
import { donateProductToBeneficiary } from "@/repository/beneficiary.repository";
import { getStorageRecords } from "@/repository/inventory.repository";
import { getBeneficiariesByOrganizationID } from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
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

const OutputProductModal = ({
    product,
    refreshList,
    modalOpenState,
    setModalOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [currentUser, setCurrentUser] = useState<UserSchema | null>(null);
    const [beneficiaries, setBeneficiaries] = useState<BeneficiarySchema[] | []>([]);
    const [storageRecords, setStorageRecords] = useState<AllocationSchema[] | []>([]);
    const [selectedStorage, setSelectedStorage] = useState<string>("");
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<string>("");
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
                            await getBeneficiariesByOrganizationID(
                                currUser.organization_id,
                                0,
                                99999,
                                ""
                            ),
                            await getStorageRecords(product.id),
                        ];

                        const [beneficiariesResponse, allocationsResponse] =
                            await Promise.all(promises);

                        setBeneficiaries(beneficiariesResponse.data.data);
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

    const handleDonate = async (): Promise<void> => {
        try {
            if (!selectedBeneficiary || !selectedStorage || !quantity) {
                throw new Error();
            }

            const storageFrom = selectedStorage.split("_");

            await donateProductToBeneficiary(selectedBeneficiary, {
                from: {
                    type: storageFrom[0] as "ORGANIZATION" | "HOUSING",
                    id: storageFrom[1],
                },
                product_type_id: product.id,
                quantity,
            });

            refreshList();

            setModalOpenState(false);
            toast({
                title: dict.commons.inventory.output.donationSuccessfulTitle,
                description: dict.commons.inventory.output.donationSuccessfulDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.inventory.output.donationFailedTitle,
                description: dict.commons.inventory.output.donationFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={modalOpenState} onOpenChange={setModalOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3 text-start">
                        {dict.commons.inventory.output.donateProductTitle}
                    </DialogTitle>
                    <DialogDescription className="text-start">
                        {dict.commons.inventory.output.donateProductDescription}
                    </DialogDescription>

                    {isLoading && (
                        <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                            {dict.commons.inventory.output.loading}
                        </h2>
                    )}

                    {error && (
                        <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                            <MdError />
                            {dict.commons.inventory.output.errorMessage}
                        </span>
                    )}

                    {currentUser && currentUser.organization_id && beneficiaries && (
                        <>
                            <div className="flex flex-col gap-6 pt-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        {dict.commons.inventory.output.whereProduct}
                                    </Label>
                                    <Select onValueChange={setSelectedStorage}>
                                        <SelectTrigger className="w-full" id="locale">
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        {storageRecords && (
                                            <SelectContent>
                                                {storageRecords?.map(storage => (
                                                    <SelectItem
                                                        value={
                                                            storage.location.id ===
                                                            currentUser.organization_id
                                                                ? `ORGANIZATION_${storage.location.id}`
                                                                : `HOUSING_${storage.location.id}`
                                                        }
                                                        key={storage.location.id}
                                                    >
                                                        {storage.location.id ===
                                                        currentUser?.organization_id
                                                            ? `${dict.commons.inventory.output.organization} (${storage.quantity} ${product.unit_type})`
                                                            : `${storage.location.name} (${storage.quantity} ${product.unit_type})`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        )}
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        {dict.commons.inventory.output.quantity}
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min={0}
                                        defaultValue={0}
                                        required
                                        onChange={e => setQuantity(Number(e.target.value))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="locale" className="text-start">
                                        {dict.commons.inventory.output.selectBeneficiary}
                                    </Label>
                                    <Select onValueChange={setSelectedBeneficiary}>
                                        <SelectTrigger className="w-full" id="locale">
                                            <SelectValue
                                                placeholder={dict.commons.inventory.output.select}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {beneficiaries?.map(beneficiary => (
                                                <SelectItem
                                                    value={beneficiary.id}
                                                    key={beneficiary.id}
                                                >
                                                    ({beneficiary.documents[0].type} -{" "}
                                                    {beneficiary.documents[0].value}){" "}
                                                    {beneficiary.full_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-5">
                                <Button variant="outline" onClick={() => setModalOpenState(false)}>
                                    {dict.commons.inventory.output.cancel}
                                </Button>
                                <Button onClick={handleDonate}>
                                    {dict.commons.inventory.output.donate}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { OutputProductModal };
