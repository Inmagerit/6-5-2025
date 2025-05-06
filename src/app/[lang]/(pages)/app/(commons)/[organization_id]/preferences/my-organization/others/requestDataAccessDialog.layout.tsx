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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createDataAccessRequest } from "@/repository/organization.repository";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    requestDialogOpenState: boolean;
    setRequestDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const RequestDataAccessDialog = ({
    requestDialogOpenState,
    setRequestDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [orgToken, setOrgToken] = useState("");

    const handleRequest = async () => {
        try {
            await createDataAccessRequest(orgToken);

            toast({
                title: dict.commons.preferences.myOrganization.others.dataAccess.dialog
                    .requestSuccessful,
                description:
                    dict.commons.preferences.myOrganization.others.dataAccess.dialog
                        .requestSuccessfulDescription,
                variant: "success",
            });

            setRequestDialogOpenState(false);
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.others.dataAccess.dialog
                    .requestFailed,
                description:
                    dict.commons.preferences.myOrganization.others.dataAccess.dialog
                        .requestFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={requestDialogOpenState} onOpenChange={setRequestDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {
                            dict.commons.preferences.myOrganization.others.dataAccess.dialog
                                .requestData
                        }
                    </DialogTitle>
                    <DialogDescription>
                        {
                            dict.commons.preferences.myOrganization.others.dataAccess.dialog
                                .requestDataDescription
                        }
                    </DialogDescription>
                    <div className="pt-4 pb-5">
                        <Input
                            type="text"
                            id="orgToken"
                            name="orgToken"
                            placeholder="Insert the organization token here"
                            required
                            onChange={e => setOrgToken(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4 pt-5">
                        <DialogClose asChild>
                            <Button variant="outline">
                                {
                                    dict.commons.preferences.myOrganization.others.dataAccess.dialog
                                        .cancel
                                }
                            </Button>
                        </DialogClose>
                        <Button onClick={handleRequest}>
                            {
                                dict.commons.preferences.myOrganization.others.dataAccess.dialog
                                    .request
                            }
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { RequestDataAccessDialog };
