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
import { acceptRequest } from "@/repository/updateOrganizationTypeRequests.repository";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { FaUser } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

type Props = {
    request: UpdateOrganizationTypeRequestSchema;
    refreshList: () => void;
    acceptDialogOpenState: boolean;
    setAcceptDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const AcceptModal = ({
    request,
    refreshList,
    acceptDialogOpenState,
    setAcceptDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const router = useRouter();

    const handleAccept = async (): Promise<void> => {
        try {
            await acceptRequest(request.id);

            if (refreshList) {
                refreshList();
            } else {
                router.push("/app/admin/requests");
            }

            toast({
                title: dict.admin.requests.accept.coordinationAccessEnabledTitle,
                description: dict.admin.requests.accept.coordinationAccessEnabledDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.admin.requests.accept.coordinationAccessChangeFailedTitle,
                description: dict.admin.requests.accept.coordinationAccessChangeFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={acceptDialogOpenState} onOpenChange={setAcceptDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.admin.requests.accept.acceptRequestTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.admin.requests.accept.acceptRequestDescription}
                    </DialogDescription>
                    <div className="flex flex-col pt-4 text-start">
                        <span className="text-sm text-slate-900 font-bold">
                            {request.organization.name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2 mt-2">
                            <FaUser />
                            {request.creator.first_name} {request.creator.last_name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2">
                            <MdMail />
                            {request.creator.email}
                        </span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">{dict.admin.requests.accept.cancel}</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleAccept}>
                                {dict.admin.requests.accept.accept}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { AcceptModal };
