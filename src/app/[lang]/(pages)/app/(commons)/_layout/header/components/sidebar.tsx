"use client";

import { OrgSelector } from "@/app/[lang]/(pages)/app/(commons)/_layout/sidebar/orgSelector.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaHome, FaUsers, FaBars, FaTimes } from "react-icons/fa";
import { FaBoxesPacking, FaHouseChimneyUser, FaUserNurse } from "react-icons/fa6";
import { MdSettings } from "react-icons/md";

const BASE_LIST_ITEM_CLASSES =
    "w-full py-2 px-4 flex items-center gap-3 text-slate-900 font-medium text-sm border-[1px] border-transparent rounded-md cursor-pointer";

const BASE_LIST_ITEM_HOVER_CLASSES = "hover:bg-slate-100 hover:border-slate-300";
const BASE_LIST_ITEM_ACTIVE_CLASSES =
    "text-relif-orange-200 bg-relif-orange-200/10 border-[1px] border-relif-orange-200/30";

const SidebarMobile = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const organizationID = pathname.split("/")[3];
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
                    "fixed top-0 left-0 h-full w-full bg-slate-50 p-4 transform transition-transform duration-300 ease-in-out z-50",
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

                {platformRole === "ORG_ADMIN" && (
                    <div className="w-full h-max py-4">
                        <div className="flex flex-col">
                            <span className="text-slate-500 font-bold text-sm pl-2 pb-3">
                                {dict.sidebar.currentOrganization}
                            </span>
                            <OrgSelector />
                        </div>
                    </div>
                )}

                <ul className="flex flex-col gap-1">
                    <span className="text-slate-500 font-bold text-sm pl-2 mb-2">Platform</span>
                    <Link href={`/${currentLanguage || "en"}/app/${organizationID}`}>
                        <li
                            className={cn(
                                BASE_LIST_ITEM_CLASSES,
                                activeOption !== "home"
                                    ? BASE_LIST_ITEM_HOVER_CLASSES
                                    : BASE_LIST_ITEM_ACTIVE_CLASSES
                            )}
                            onClick={toggleSidebar}
                        >
                            <FaHome size={15} />
                            {dict.sidebar.home}
                        </li>
                    </Link>

                    <Link href={`/${currentLanguage || "en"}/app/${organizationID}/housings`}>
                        <li
                            className={cn(
                                BASE_LIST_ITEM_CLASSES,
                                activeOption !== "housings"
                                    ? BASE_LIST_ITEM_HOVER_CLASSES
                                    : BASE_LIST_ITEM_ACTIVE_CLASSES
                            )}
                            onClick={toggleSidebar}
                        >
                            <FaHouseChimneyUser size={15} />
                            {dict.sidebar.housings}
                        </li>
                    </Link>

                    <Link href={`/${currentLanguage || "en"}/app/${organizationID}/beneficiaries`}>
                        <li
                            className={cn(
                                BASE_LIST_ITEM_CLASSES,
                                activeOption !== "beneficiaries"
                                    ? BASE_LIST_ITEM_HOVER_CLASSES
                                    : BASE_LIST_ITEM_ACTIVE_CLASSES
                            )}
                            onClick={toggleSidebar}
                        >
                            <FaUsers size={15} />
                            {dict.sidebar.beneficiaries}
                        </li>
                    </Link>

                    <Link href={`/${currentLanguage || "en"}/app/${organizationID}/volunteers`}>
                        <li
                            className={cn(
                                BASE_LIST_ITEM_CLASSES,
                                activeOption !== "volunteers"
                                    ? BASE_LIST_ITEM_HOVER_CLASSES
                                    : BASE_LIST_ITEM_ACTIVE_CLASSES
                            )}
                            onClick={toggleSidebar}
                        >
                            <FaUserNurse size={15} />
                            {dict.sidebar.volunteers}
                        </li>
                    </Link>

                    <Link href={`/${currentLanguage || "en"}/app/${organizationID}/inventory`}>
                        <li
                            className={cn(
                                BASE_LIST_ITEM_CLASSES,
                                activeOption !== "inventory"
                                    ? BASE_LIST_ITEM_HOVER_CLASSES
                                    : BASE_LIST_ITEM_ACTIVE_CLASSES
                            )}
                            onClick={toggleSidebar}
                        >
                            <FaBoxesPacking size={15} />
                            {dict.sidebar.inventory}
                        </li>
                    </Link>
                </ul>

                <span className="w-full border-b-[1px] border-slate-200" />

                <ul className="flex flex-col gap-1">
                    <Link
                        href={`/${currentLanguage || "en"}/app/${organizationID}/preferences/platform`}
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
                            {dict.sidebar.preferences}
                        </li>
                    </Link>
                </ul>
            </nav>
        </div>
    );
};

export { SidebarMobile };
