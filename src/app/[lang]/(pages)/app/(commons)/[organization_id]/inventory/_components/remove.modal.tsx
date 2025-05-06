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
import { useToast } from "@/components/ui/use-toast";
import { deleteProduct, getStorageRecords } from "@/repository/inventory.repository";
import { ProductSchema } from "@/types/product.types";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type Props = {
    product: ProductSchema;
    refreshList: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    product,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allowToRemove, setAllowToRemove] = useState<
        "LOADING" | "UNAVAILABLE" | "AVAILABLE" | "ERROR"
    >("LOADING");

    useEffect(() => {
        (async () => {
            try {
                if (removeDialogOpenState) {
                    const { data } = await getStorageRecords(product.id);

                    if (data[0].quantity) {
                        setAllowToRemove("UNAVAILABLE");
                    } else {
                        setAllowToRemove("AVAILABLE");
                    }
                }
            } catch {
                setAllowToRemove("ERROR");
            }
        })();
    }, [removeDialogOpenState]);

    const handleDelete = async (): Promise<void> => {
        try {
            setIsLoading(true);

            await deleteProduct(product.id);

            refreshList();

            setRemoveDialogOpenState(false);

            toast({
                title: dict.commons.inventory.remove.productDeletedSuccessTitle,
                description: dict.commons.inventory.remove.productDeletedSuccessDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.commons.inventory.remove.errorDeletingProductTitle,
                description: dict.commons.inventory.remove.errorDeletingProductDescription,
                variant: "destructive",
            });
        }
    };

    if (product) {
        return (
            <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-3 text-start">
                            {dict.commons.inventory.remove.title}
                        </DialogTitle>
                        <DialogDescription className="text-start">
                            {dict.commons.inventory.remove.description}
                        </DialogDescription>
                        <div className="flex flex-col pt-4">
                            <span className="text-sm text-slate-900 font-bold text-start">
                                {product?.name}
                            </span>
                            <span className="text-xs text-slate-500 text-start">
                                {product?.brand} - {product?.category}
                            </span>
                        </div>

                        {allowToRemove === "LOADING" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <Button disabled>{dict.commons.inventory.remove.loading}</Button>
                            </div>
                        )}

                        {allowToRemove === "AVAILABLE" && (
                            <div className="flex gap-4 pt-5">
                                <Button
                                    variant="outline"
                                    onClick={() => setRemoveDialogOpenState(false)}
                                >
                                    {dict.commons.inventory.remove.cancel}
                                </Button>
                                <Button onClick={handleDelete}>
                                    {!isLoading
                                        ? dict.commons.inventory.remove.remove
                                        : dict.commons.inventory.remove.loading}
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "UNAVAILABLE" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500 text-start">
                                    {dict.commons.inventory.remove.unavailableMessage}
                                </span>
                                <Button onClick={() => setRemoveDialogOpenState(false)}>
                                    {dict.commons.inventory.remove.close}
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "ERROR" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500 text-start">
                                    {dict.commons.inventory.remove.errorMessage}
                                </span>
                                <Button onClick={() => setRemoveDialogOpenState(false)}>
                                    {dict.commons.inventory.remove.close}
                                </Button>
                            </div>
                        )}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        );
    }

    return <div />;
};

export { RemoveModal };
