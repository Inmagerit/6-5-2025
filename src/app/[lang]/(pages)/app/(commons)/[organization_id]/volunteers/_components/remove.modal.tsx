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
import { deleteVolunteer } from "@/repository/volunteer.repository";
import { VoluntarySchema } from "@/types/voluntary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    volunteer: VoluntarySchema;
    refreshList?: () => void;
    removeDialogOpenState: boolean;
    setRemoveDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RemoveModal = ({
    volunteer,
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

            await deleteVolunteer(volunteer.id);
            if (refreshList) {
                refreshList();
            } else {
                router.push(backToListPath);
            }

            toast({
                title: dict.commons.volunteers.list.remove.removedSuccess,
                description: dict.commons.volunteers.list.remove.removedSuccessDescription,
                variant: "success",
            });
        } catch {
            setIsLoading(false);
            toast({
                title: dict.commons.volunteers.list.remove.removalFailedTitle,
                description: dict.commons.volunteers.list.remove.removalFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={removeDialogOpenState} onOpenChange={setRemoveDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.commons.volunteers.list.remove.title}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.commons.volunteers.list.remove.description}
                    </DialogDescription>
                    <div className="flex flex-col pt-4">
                        <span className="text-sm text-slate-900 font-bold text-start">
                            {convertToTitleCase(volunteer.full_name)}
                        </span>
                        <span className="text-xs text-slate-500 text-start">{volunteer.email}</span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <Button variant="outline" onClick={() => setRemoveDialogOpenState(false)}>
                            {dict.commons.volunteers.list.remove.cancel}
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleDelete}>
                                {!isLoading
                                    ? dict.commons.volunteers.list.remove.delete
                                    : dict.commons.volunteers.list.remove.loading}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RemoveModal };
