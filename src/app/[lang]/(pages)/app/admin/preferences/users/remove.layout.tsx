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

    const handleDelete = async (): Promise<void> => {
        try {
            await deleteUser(user.id);
            refreshList();

            setRemoveUserDialogOpenState(false);
            toast({
                title: dict.admin.preferences.users.remove.removedTitle,
                description: dict.admin.preferences.users.remove.removedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.admin.preferences.users.remove.deletionFailedTitle,
                description: dict.admin.preferences.users.remove.deletionFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={removeUserDialogOpenState} onOpenChange={setRemoveUserDialogOpenState}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="pb-3">
                        {dict.admin.preferences.users.remove.confirmationTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.admin.preferences.users.remove.confirmationDescription}
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
                            {dict.admin.preferences.users.remove.cancel}
                        </Button>
                        <DialogClose asChild>
                            <Button onClick={handleDelete}>
                                {dict.admin.preferences.users.remove.delete}
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { UserRemove };
