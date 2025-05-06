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
import { deleteSpace, getBeneficiariesBySpaceId } from "@/repository/spaces.repository";
import { SpaceSchema } from "@/types/space.types";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";

type Props = {
    space: SpaceSchema;
    refreshList: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveSpaceModal = ({
    space,
    refreshList,
    removeDialogOpenState,
    setRemoveDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const pathname = usePathname();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [allowToRemove, setAllowToRemove] = useState<
        "LOADING" | "UNAVAILABLE" | "AVAILABLE" | "ERROR"
    >("LOADING");
    const OFFSET = 0;
    const LIMIT = 9999;

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getBeneficiariesBySpaceId(space.id, OFFSET, LIMIT);
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

            await deleteSpace(space.id);
            refreshList();

            toast({
                title: dict.housingOverview.removeSpaceModal.toastSuccessTitle,
                description: dict.housingOverview.removeSpaceModal.toastSuccessDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.housingOverview.removeSpaceModal.toastErrorTitle,
                description: dict.housingOverview.removeSpaceModal.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.housingOverview.removeSpaceModal.title}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.housingOverview.removeSpaceModal.description}
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold">{space?.name}</span>
                        <span className="text-xs text-slate-500">
                            {dict.housingOverview.removeSpaceModal.createdAt}{" "}
                            {formatDate(space?.created_at, locale || "en")}
                        </span>
                    </div>

                    {allowToRemove === "LOADING" && (
                        <div className="flex flex-col gap-4 pt-10">
                            <span className="text-xs text-blue-500">
                                {dict.housingOverview.removeSpaceModal.loadingMessage}
                            </span>
                            <Button disabled>
                                {dict.housingOverview.removeSpaceModal.loading}
                            </Button>
                        </div>
                    )}

                    {allowToRemove === "AVAILABLE" && (
                        <div className="flex gap-4 pt-5">
                            <Button
                                variant="outline"
                                onClick={() => setRemoveDialogOpenState(false)}
                            >
                                {dict.housingOverview.removeSpaceModal.btnCancel}
                            </Button>
                            <DialogClose asChild>
                                <Button onClick={handleDelete}>
                                    {!isLoading
                                        ? dict.housingOverview.removeSpaceModal.btnRemove
                                        : dict.housingOverview.removeSpaceModal.loading}
                                </Button>
                            </DialogClose>
                        </div>
                    )}

                    {allowToRemove === "UNAVAILABLE" && (
                        <div className="flex flex-col gap-4 pt-10">
                            <span className="text-xs text-red-500">
                                {dict.housingOverview.removeSpaceModal.alertStatusUnavailable}
                            </span>
                            <Button onClick={() => setRemoveDialogOpenState(false)}>
                                {dict.housingOverview.removeSpaceModal.btnClose}
                            </Button>
                        </div>
                    )}

                    {allowToRemove === "ERROR" && (
                        <div className="flex flex-col gap-4 pt-10">
                            <span className="text-xs text-red-500">
                                {dict.housingOverview.removeSpaceModal.alertStatusError}
                            </span>
                            <Button onClick={() => setRemoveDialogOpenState(false)}>
                                {dict.housingOverview.removeSpaceModal.btnClose}
                            </Button>
                        </div>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RemoveSpaceModal };
