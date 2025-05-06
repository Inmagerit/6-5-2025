"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { deleteBeneficiary } from "@/repository/beneficiary.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FaHouseChimneyUser } from "react-icons/fa6";

type Props = {
    beneficiary: BeneficiarySchema;
    refreshList?: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    beneficiary,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const dict = useDictionary();

    const [isLoading, setIsLoading] = useState(false);
    const backToListPath = pathname.split("/").slice(0, 5).join("/");

    const handleDelete = async (): Promise<void> => {
        try {
            setIsLoading(true);

            await deleteBeneficiary(beneficiary.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            toast({
                title: dict.commons.beneficiaries.removeModal.toastSuccessTitle,
                description: dict.commons.beneficiaries.removeModal.toastSuccessDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.commons.beneficiaries.removeModal.toastErrorTitle,
                description: dict.commons.beneficiaries.removeModal.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.commons.beneficiaries.removeModal.confirmRemoveTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.commons.beneficiaries.removeModal.confirmRemoveDescription}
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold text-left">
                            {convertToTitleCase(beneficiary.full_name)}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1 text-left">
                            <FaHouseChimneyUser />
                            {beneficiary?.current_housing.name ||
                                dict.commons.beneficiaries.removeModal.unallocated}
                        </span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setRemoveDialogOpenState(false)}>
                            {dict.commons.beneficiaries.removeModal.cancel}
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleDelete}>
                                {!isLoading
                                    ? dict.commons.beneficiaries.removeModal.delete
                                    : dict.commons.beneficiaries.removeModal.loading}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RemoveModal };
