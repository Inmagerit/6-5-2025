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
import { deleteHousing, getBeneficiariesByHousingId } from "@/repository/housing.repository";
import { HousingSchema } from "@/types/housing.types";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type Props = {
    housing: HousingSchema;
    refreshList?: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    housing,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const dict = useDictionary();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allowToRemove, setAllowToRemove] = useState<
        "LOADING" | "UNAVAILABLE" | "AVAILABLE" | "ERROR"
    >("LOADING");
    const backToListPath = pathname.split("/").slice(0, 5).join("/");
    const OFFSET = 0;
    const LIMIT = 9999;

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getBeneficiariesByHousingId(housing.id, OFFSET, LIMIT, "");
                const beneficiaries = data.data;

                if (beneficiaries.length > 0) {
                    setAllowToRemove("UNAVAILABLE");
                } else {
                    setAllowToRemove("AVAILABLE");
                }
            } catch {
                setAllowToRemove("ERROR");
            }
        })();
    }, []);

    const handleDelete = async (): Promise<void> => {
        try {
            setIsLoading(true);

            await deleteHousing(housing.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            setRemoveDialogOpenState(false);

            toast({
                title: dict.removeHousing.toastSuccessTitle,
                description: dict.removeHousing.toastSuccessDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.removeHousing.toastErrorTitle,
                description: dict.removeHousing.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    if (housing && housing.address) {
        return (
            <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="pb-3">{dict.removeHousing.title}</DialogTitle>
                        <DialogDescription>{dict.removeHousing.description}</DialogDescription>
                        <div className="flex flex-col pt-4 text-start">
                            <span className="text-sm text-slate-900 font-bold">
                                {housing?.name}
                            </span>
                            <span className="text-xs text-slate-500">
                                {`${housing?.address.address_line_1}, ${housing?.address.address_line_2} - ${housing?.address.city}, ${housing?.address.district} | ${housing?.address.zip_code} - ${housing?.address.country}`}
                            </span>
                        </div>

                        {allowToRemove === "LOADING" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-blue-500">
                                    {dict.removeHousing.statusLoadingMessage}
                                </span>
                                <Button disabled>{dict.removeHousing.loading}</Button>
                            </div>
                        )}

                        {allowToRemove === "AVAILABLE" && (
                            <div className="flex gap-4 pt-5">
                                <Button
                                    variant="outline"
                                    onClick={() => setRemoveDialogOpenState(false)}
                                >
                                    {dict.removeHousing.btnCancel}
                                </Button>
                                <Button onClick={handleDelete}>
                                    {!isLoading
                                        ? dict.removeHousing.btnRemove
                                        : dict.removeHousing.loading}
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "UNAVAILABLE" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500">
                                    {dict.removeHousing.statusUnavailableMessage}
                                </span>
                                <Button onClick={() => setRemoveDialogOpenState(false)}>
                                    {dict.removeHousing.btnClose}
                                </Button>
                            </div>
                        )}

                        {allowToRemove === "ERROR" && (
                            <div className="flex flex-col gap-4 pt-10">
                                <span className="text-xs text-red-500">
                                    {dict.removeHousing.statusErrorMessage}
                                </span>
                                <Button onClick={() => setRemoveDialogOpenState(false)}>
                                    {dict.removeHousing.btnClose}
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
