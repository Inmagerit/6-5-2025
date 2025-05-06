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
import { acceptRequest } from "@/repository/organizationDataAccessRequests.repository";
import { OrganizationDataAccessRequestSchema } from "@/types/organization.types";
import { ReactNode } from "react";

type Props = {
    request: OrganizationDataAccessRequestSchema;
    refreshList: () => void;
    children: Readonly<ReactNode>;
};

const OrganizationInviteDialog = ({ request, refreshList, children }: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const handleAccept = async () => {
        try {
            await acceptRequest(request.id);
            refreshList();
            toast({
                title: dict.commons.preferences.myOrganization.invites.organization.dialog.toast
                    .requestAccepted,
                description:
                    dict.commons.preferences.myOrganization.invites.organization.dialog.toast
                        .requestAcceptedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.invites.organization.dialog.toast
                    .requestFailed,
                description:
                    dict.commons.preferences.myOrganization.invites.organization.dialog.toast
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
                        {
                            dict.commons.preferences.myOrganization.invites.organization.dialog
                                .acceptDataAccessRequest
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {
                            dict.commons.preferences.myOrganization.invites.organization.dialog
                                .confirmingRequest
                        }
                    </DialogDescription>
                    <div className="flex flex-col pt-4 text-start">
                        <span className="text-sm text-slate-900 font-bold">
                            {request.requester_organization.name}
                        </span>
                        <span className="text-xs text-slate-500">
                            <strong>
                                {
                                    dict.commons.preferences.myOrganization.invites.organization
                                        .dialog.requester
                                }
                                :{" "}
                            </strong>
                            {request.requester.first_name} {request.requester.last_name}
                        </span>
                        <span className="text-xs text-slate-500">
                            <strong>
                                {
                                    dict.commons.preferences.myOrganization.invites.organization
                                        .dialog.by
                                }
                                :
                            </strong>{" "}
                            {request.requester.email}
                        </span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">
                                {
                                    dict.commons.preferences.myOrganization.invites.organization
                                        .dialog.cancel
                                }
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleAccept}>
                                {
                                    dict.commons.preferences.myOrganization.invites.organization
                                        .dialog.accept
                                }
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { OrganizationInviteDialog };
