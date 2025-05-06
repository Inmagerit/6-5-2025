"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
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
import { reactiveUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    user: UserSchema;
    refreshList: () => void;
    reactivateUserDialogOpenState: boolean;
    setReactivateUserDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const UserReactivate = ({
    user,
    refreshList,
    reactivateUserDialogOpenState,
    setReactivateUserDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const handleReactivate = async (): Promise<void> => {
        try {
            if (platformRole !== "ORG_ADMIN") {
                throw new Error();
            }

            await reactiveUser(user.id);
            refreshList();

            setReactivateUserDialogOpenState(false);
            toast({
                title: dict.commons.preferences.myOrganization.users.reactivate.reactivated,
                description:
                    dict.commons.preferences.myOrganization.users.reactivate.reactivatedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.users.reactivate
                    .userReactivationFailed,
                description:
                    dict.commons.preferences.myOrganization.users.reactivate
                        .userReactivationFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog
            open={reactivateUserDialogOpenState}
            onOpenChange={setReactivateUserDialogOpenState}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.commons.preferences.myOrganization.users.reactivate.absolutelySure}{" "}
                    </DialogTitle>
                    <DialogDescription>
                        {
                            dict.commons.preferences.myOrganization.users.reactivate
                                .actionCannotBeUndone
                        }{" "}
                    </DialogDescription>
                    <div className="flex flex-col pt-4 text-start">
                        <span className="text-sm text-slate-900 font-bold">
                            {user?.first_name} {user?.last_name}
                        </span>
                        <span className="text-xs text-slate-500">{user?.email}</span>
                    </div>
                    <div className="flex gap-4 pt-5">
                        <Button
                            variant="outline"
                            onClick={() => setReactivateUserDialogOpenState(false)}
                        >
                            {dict.commons.preferences.myOrganization.users.reactivate.cancel}{" "}
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleReactivate}>
                                {
                                    dict.commons.preferences.myOrganization.users.reactivate
                                        .reactivate
                                }
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { UserReactivate };
