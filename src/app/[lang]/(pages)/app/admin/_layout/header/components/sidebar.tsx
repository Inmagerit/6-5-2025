"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaBuilding, FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { MdSettings } from "react-icons/md";

const BASE_LIST_ITEM_CLASSES =
    "w-full py-2 px-4 flex items-center gap-3 text-slate-900 font-medium text-sm border-[1px] border-transparent rounded-md cursor-pointer";

const BASE_LIST_ITEM_HOVER_CLASSES = "hover:bg-slate-100 hover:border-slate-300";
const BASE_LIST_ITEM_ACTIVE_CLASSES =
    "text-relif-orange-200 bg-relif-orange-200/10 border-[1px] border-relif-orange-200/30";

const MobileSidebar = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();
    const activeOption = pathname.split("/")[4] ?? "home";
    const currentLanguage = pathname.split("/")[1];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <Button
                variant="icon"
                className="w-7 h-7 p-0"
                aria-label="Toggle sidebar"
                onClick={toggleSidebar}
            >
                <FaBars />
            </Button>

            <nav
                className={cn(
                    "fixed top-0 left-0 h-full w-[250px] bg-slate-50 p-4 transform transition-transform duration-300 ease-in-out z-50",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <Button
                    variant="icon"
                    className="w-7 h-7 p-0"
                    aria-label="Toggle sidebar"
                    onClick={toggleSidebar}
                >
                    <FaTimes />
                </Button>

                <div className="h-[49px] p-2 mt-5">
                    <Image
                        src="/images/logo-relif-black.svg"
                        alt="Logo Relif Black"
                        width={126}
                        height={41}
                    />
                </div>

                {platformRole === "RELIF_MEMBER" && (
                    <>
                        <ul className="flex flex-col gap-1">
                            <span className="text-slate-500 font-bold text-sm pl-2 mb-2">
                                {dict.admin.sidebar.admin}
                            </span>

                            <Link href={`/${currentLanguage || "en"}/app/admin/organizations`}>
                                <li
                                    className={cn(
                                        BASE_LIST_ITEM_CLASSES,
                                        activeOption !== "organizations"
                                            ? BASE_LIST_ITEM_HOVER_CLASSES
                                            : BASE_LIST_ITEM_ACTIVE_CLASSES
                                    )}
                                    onClick={toggleSidebar}
                                >
                                    <FaBuilding size={15} />
                                    {dict.admin.sidebar.organizations}
                                </li>
                            </Link>

                            <Link href={`/${currentLanguage || "en"}/app/admin/requests`}>
                                <li
                                    className={cn(
                                        BASE_LIST_ITEM_CLASSES,
                                        activeOption !== "requests"
                                            ? BASE_LIST_ITEM_HOVER_CLASSES
                                            : BASE_LIST_ITEM_ACTIVE_CLASSES
                                    )}
                                    onClick={toggleSidebar}
                                >
                                    <FaUsers size={15} />
                                    {dict.admin.sidebar.requests}
                                </li>
                            </Link>
                        </ul>

                        <span className="w-full border-b-[1px] border-slate-200" />

                        <ul className="flex flex-col gap-1">
                            <Link
                                href={`/${currentLanguage || "en"}/app/admin/preferences/platform`}
                            >
                                <li
                                    className={cn(
                                        BASE_LIST_ITEM_CLASSES,
                                        activeOption !== "preferences"
                                            ? BASE_LIST_ITEM_HOVER_CLASSES
                                            : BASE_LIST_ITEM_ACTIVE_CLASSES
                                    )}
                                    onClick={toggleSidebar}
                                >
                                    <MdSettings size={15} />
                                    {dict.admin.sidebar.preferences}
                                </li>
                            </Link>
                        </ul>
                    </>
                )}
            </nav>
        </div>
    );
};

export { MobileSidebar };
