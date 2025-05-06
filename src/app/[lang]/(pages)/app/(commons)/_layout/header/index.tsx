"use client";

import { Breadcrumb } from "@/app/[lang]/(pages)/app/(commons)/_layout/header/components/breadcrumb.layout";
import { UserDropdown } from "@/app/[lang]/(pages)/app/(commons)/_layout/header/components/userDropdown.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { HiMiniBellAlert } from "react-icons/hi2";
import { MdSettings } from "react-icons/md";

import { SidebarMobile } from "./components/sidebar";

const Header = (): ReactNode => {
    const dict = useDictionary();
    const pathname = usePathname();
    const urlPath = pathname.split("/").slice(0, 4).join("/");
    const isEntry = pathname.split("/")[3] === "entry";

    const currentUser: UserSchema = getFromLocalStorage("r_ud");

    return (
        <header className="col-span-1 w-full h-max border-b-[1px] border-slate-200 flex items-center justify-between py-2 px-4">
            {!isEntry ? (
                <div className="min-custom:hidden">
                    <SidebarMobile />
                </div>
            ) : (
                <div />
            )}

            {!isEntry && <Breadcrumb />}

            <div className="flex items-center gap-2">
                {!isEntry && (
                    <>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="icon" asChild className="w-7 h-7 p-0">
                                        <Link href="#">
                                            <HiMiniBellAlert />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{dict.commons.notifications}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                                    <p>{dict.commons.header.preferences}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </>
                )}

                <div className="flex items-center justify-center pl-2">
                    {currentUser ? (
                        <UserDropdown isEntry={isEntry}>
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-relif-orange-200 text-white">
                                    {currentUser.first_name
                                        .charAt(0)
                                        .concat(currentUser.last_name.charAt(0))
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </UserDropdown>
                    ) : (
                        <UserDropdown isEntry={isEntry}>
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-relif-orange-200 text-white">
                                    US
                                </AvatarFallback>
                            </Avatar>
                        </UserDropdown>
                    )}
                </div>
            </div>
        </header>
    );
};

export { Header };
