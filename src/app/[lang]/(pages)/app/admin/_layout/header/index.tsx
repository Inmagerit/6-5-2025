"use client";

import { Breadcrumb } from "@/app/[lang]/(pages)/app/admin/_layout/header/components/breadcrumb.layout";
import { UserDropdown } from "@/app/[lang]/(pages)/app/admin/_layout/header/components/userDropdown.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { MdSettings } from "react-icons/md";

import { MobileSidebar } from "./components/sidebar";

const Header = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const urlPath = pathname.split("/").slice(0, 4).join("/");

    const currentUser: UserSchema = getFromLocalStorage("r_ud");

    return (
        <header className="col-span-1 w-full h-max border-b-[1px] border-slate-200 flex items-center justify-between py-2 px-4">
            <div className="min-custom:hidden">
                <MobileSidebar />
            </div>
            <Breadcrumb />

            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button variant="icon" asChild className="w-7 h-7 p-0">
                                <Link href={`${urlPath}/preferences/platform`}>
                                    <MdSettings />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{dict.admin.header.preferences}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex items-center justify-center pl-2">
                    <UserDropdown>
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-relif-orange-200 text-white">
                                {currentUser.first_name
                                    .charAt(0)
                                    .concat(currentUser.last_name.charAt(0))
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </UserDropdown>
                </div>
            </div>
        </header>
    );
};

export { Header };
