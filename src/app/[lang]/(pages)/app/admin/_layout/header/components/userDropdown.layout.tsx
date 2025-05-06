"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "@/repository/auth.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage, removeFromLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const UserDropdown = ({ children }: { children: ReactNode }): ReactNode => {
    const dict = useDictionary();
    const router = useRouter();
    const { toast } = useToast();

    const [user, setUser] = useState<UserSchema | null>(null);

    const onHandleSignOut = async (): Promise<void> => {
        try {
            await signOut();
            removeFromLocalStorage("r_to");
            removeFromLocalStorage("r_ud");
            router.push("/", { scroll: false });
        } catch {
            toast({
                title: dict.commons.header.toastErrorTitle,
                description: dict.commons.header.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        try {
            const currentUser = getFromLocalStorage("r_ud");
            if (currentUser) {
                setUser(currentUser);
            } else {
                throw new Error();
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    {dict.commons.header.hi}, {user?.first_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onHandleSignOut}>
                    {dict.commons.header.logout}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { UserDropdown };
