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
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { acceptRequest } from "@/repository/joinOrganizationRequests.repository";
import { JoinOrganizationRequestSchema } from "@/types/requests.types";
import { ReactNode } from "react";

type Props = {
    request: JoinOrganizationRequestSchema;
    refreshList: () => void;
    children: Readonly<ReactNode>;
};

const UserInviteDialogLayout = ({ request, refreshList, children }: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const handleAccept = async () => {
        try {
            await acceptRequest(request.id);
            refreshList();
            toast({
                title: dict.commons.preferences.myOrganization.invites.user.dialog.requestAccepted,
                description:
                    dict.commons.preferences.myOrganization.invites.user.dialog
                        .requestAcceptedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.invites.user.dialog.requestFailed,
                description:
                    dict.commons.preferences.myOrganization.invites.user.dialog
                        .requestFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.commons.preferences.myOrganization.invites.user.dialog.acceptRequest}
                    </DialogTitle>
                    <DialogDescription>
                        {
                            dict.commons.preferences.myOrganization.invites.user.dialog
                                .confirmingRequest
                        }
                    </DialogDescription>
                    <div className="flex flex-col pt-4 text-start">
                        <span className="text-sm text-slate-900 font-bold">
                            {request.user.first_name} {request.user.last_name}
                        </span>
                        <span className="text-xs text-slate-500">{request.user.email}</span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">
                                {dict.commons.preferences.myOrganization.invites.user.dialog.cancel}
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleAccept}>
                                {dict.commons.preferences.myOrganization.invites.user.dialog.accept}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { UserInviteDialogLayout };
