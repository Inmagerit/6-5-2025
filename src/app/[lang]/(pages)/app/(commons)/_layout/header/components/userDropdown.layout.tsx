"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "@/repository/auth.repository";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage, removeFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

type Props = {
    children: ReactNode;
    isEntry: boolean;
};

const UserDropdown = ({ children, isEntry }: Props): ReactNode => {
    const dict = useDictionary();
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();

    const urlPath = pathname.split("/").slice(0, 4).join("/");
    const [user, setUser] = useState<UserSchema | null>(null);

    const onHandleSignOut = async (): Promise<void> => {
        try {
            await signOut();
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
                {!isEntry && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/preferences/my-profile`}>
                                {dict.commons.header.profile}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                {dict.commons.header.preferences}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <Link href={`${urlPath}/preferences/my-organization/users`}>
                                        {dict.commons.header.team}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={`${urlPath}/preferences/my-organization/overview`}>
                                        {dict.commons.header.organization}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={`${urlPath}/preferences/platform`}>
                                        {dict.commons.header.platform}
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href={`${urlPath}/preferences/support`}>
                                        {dict.commons.header.support}
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                    </>
                )}

                <DropdownMenuItem onClick={onHandleSignOut}>
                    {dict.commons.header.logout}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { UserDropdown };
