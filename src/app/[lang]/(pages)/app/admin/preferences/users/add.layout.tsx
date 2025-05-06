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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createInvite } from "@/repository/joinPlatformAdminInvites.repository";
import { ReactNode } from "react";

const AddUser = ({ children }: { children: Readonly<ReactNode> }): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                email: string;
            } = Object.fromEntries(formData);

            await createInvite(data.email);

            toast({
                title: dict.admin.preferences.users.add.successTitle,
                description: dict.admin.preferences.users.add.successDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.admin.preferences.users.add.errorTitle,
                description: dict.admin.preferences.users.add.errorDescription,
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
                        {dict.admin.preferences.users.add.inviteNewUser}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.admin.preferences.users.add.enterEmail}
                    </DialogDescription>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col pt-4 gap-2 text-start">
                            <Label htmlFor="email">{dict.admin.preferences.users.add.email}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder={dict.admin.preferences.users.add.placeholder}
                            />
                        </div>
                        <div className="flex gap-4 pt-5">
                            <DialogClose asChild>
                                <Button variant="outline">
                                    {dict.admin.preferences.users.add.cancel}
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                {dict.admin.preferences.users.add.inviteUser}
                            </Button>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { AddUser };
