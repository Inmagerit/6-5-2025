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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { rejectRequest } from "@/repository/updateOrganizationTypeRequests.repository";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { FaUser } from "react-icons/fa6";
import { MdMail } from "react-icons/md";

type Props = {
    request: UpdateOrganizationTypeRequestSchema;
    refreshList: () => void;
    rejectDialogOpenState: boolean;
    setRejectDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RejectModal = ({
    request,
    refreshList,
    rejectDialogOpenState,
    setRejectDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const router = useRouter();
    const [rejectReason, setRejectReason] = useState("");

    const handleReject = async (): Promise<void> => {
        try {
            await rejectRequest(request.id, rejectReason);

            if (refreshList) {
                refreshList();
            } else {
                router.push("/app/admin/requests");
            }

            toast({
                title: dict.admin.requests.reject.requestRejectedTitle,
                description: dict.admin.requests.reject.requestRejectedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.admin.requests.reject.rejectionFailedTitle,
                description: dict.admin.requests.reject.rejectuibFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={rejectDialogOpenState} onOpenChange={setRejectDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.admin.requests.reject.rejectRequestTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.admin.requests.reject.rejectRequestDescription}
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
                    <div className="flex flex-col gap-3 w-full pt-5 text-start">
                        <Label htmlFor="react-reason">
                            {dict.admin.requests.reject.rejectReason}
                        </Label>
                        <textarea
                            className="flex min-h-20 resize-none w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-relif-orange-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="reject-reason"
                            name="reject-reason"
                            value={rejectReason}
                            placeholder="Max 250 characters"
                            onChange={e => setRejectReason(e.target.value)}
                            maxLength={250}
                            required
                        />
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">{dict.admin.requests.reject.cancel}</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleReject}>
                                {dict.admin.requests.reject.reject}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RejectModal };
