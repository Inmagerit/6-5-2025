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
import { deleteUser } from "@/repository/user.repository";
import { UserSchema } from "@/types/user.types";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    user: UserSchema;
    refreshList: () => void;
    removeUserDialogOpenState: boolean;
    setRemoveUserDialogOpenState: Dispatch<SetStateAction<boolean>>;
};

const UserRemove = ({
    user,
    refreshList,
    removeUserDialogOpenState,
    setRemoveUserDialogOpenState,
}: Props): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const handleDelete = async (): Promise<void> => {
        try {
            if (platformRole !== "ORG_ADMIN") {
                throw new Error();
            }

            await deleteUser(user.id);
            refreshList();

            setRemoveUserDialogOpenState(false);
            toast({
                title: dict.commons.preferences.myOrganization.users.remove.removed,
                description:
                    dict.commons.preferences.myOrganization.users.remove.removedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.users.remove.userDeletionFailed,
                description:
                    dict.commons.preferences.myOrganization.users.remove
                        .userDeletionFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={removeUserDialogOpenState} onOpenChange={setRemoveUserDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.commons.preferences.myOrganization.users.remove.absolutelySure}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.commons.preferences.myOrganization.users.remove.actionCannotBeUndone}
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
                            onClick={() => setRemoveUserDialogOpenState(false)}
                        >
                            {dict.commons.preferences.myOrganization.users.remove.cancel}
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleDelete}>
                                {dict.commons.preferences.myOrganization.users.remove.delete}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { UserRemove };
