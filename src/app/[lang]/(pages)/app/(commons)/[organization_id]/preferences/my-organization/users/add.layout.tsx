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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { createInvite } from "@/repository/joinPlatformInvites.repository";
import { ReactNode } from "react";

const AddUser = ({ children }: { children: Readonly<ReactNode> }): ReactNode => {
    const { toast } = useToast();
    const platformRole = usePlatformRole();
    const dict = useDictionary();

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            if (platformRole !== "ORG_ADMIN") {
                throw new Error();
            }

            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                email: string;
            } = Object.fromEntries(formData);

            await createInvite(data.email);
            toast({
                title: dict.commons.preferences.myOrganization.users.add.success,
                description: dict.commons.preferences.myOrganization.users.add.successDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.users.add.error,
                description: dict.commons.preferences.myOrganization.users.add.errorDescription,
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
                        {dict.commons.preferences.myOrganization.users.add.inviteNewUser}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.commons.preferences.myOrganization.users.add.enterEmail}
                    </DialogDescription>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col pt-4 gap-2 text-start">
                            <Label htmlFor="email">
                                {dict.commons.preferences.myOrganization.users.add.email} *
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder={
                                    dict.commons.preferences.myOrganization.users.add
                                        .emailPlaceholder
                                }
                            />
                        </div>
                        <div className="flex gap-4 pt-5">
                            <DialogClose asChild>
                                <Button variant="outline">
                                    {dict.commons.preferences.myOrganization.users.add.cancel}
                                </Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button type="submit">
                                    {dict.commons.preferences.myOrganization.users.add.inviteUser}
                                </Button>
                            </DialogClose>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export { AddUser };
