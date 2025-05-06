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
import { createRequest } from "@/repository/updateOrganizationTypeRequests.repository";
import { ReactNode } from "react";

const CoordinationRequestDialog = ({ children }: { children: Readonly<ReactNode> }): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const handleRequest = async () => {
        try {
            await createRequest();
            toast({
                title: dict.commons.preferences.myOrganization.others.coordination.dialog
                    .requestSuccessful,
                description:
                    dict.commons.preferences.myOrganization.others.coordination.dialog
                        .requestSuccessfulDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.others.coordination.dialog
                    .requestFailed,
                description:
                    dict.commons.preferences.myOrganization.others.coordination.dialog
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
                            dict.commons.preferences.myOrganization.others.coordination.dialog
                                .requestFeature
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {
                            dict.commons.preferences.myOrganization.others.coordination.dialog
                                .requestDescriptionPart1
                        }{" "}
                        <strong>
                            {
                                dict.commons.preferences.myOrganization.others.coordination.dialog
                                    .requestDescriptionPart2
                            }
                        </strong>{" "}
                        {
                            dict.commons.preferences.myOrganization.others.coordination.dialog
                                .requestDescriptionPart3
                        }
                    </DialogDescription>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">
                                {
                                    dict.commons.preferences.myOrganization.others.coordination
                                        .dialog.cancel
                                }
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button onClick={handleRequest}>
                                {
                                    dict.commons.preferences.myOrganization.others.coordination
                                        .dialog.sendRequest
                                }
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { CoordinationRequestDialog };
