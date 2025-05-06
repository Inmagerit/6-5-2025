"use client";

import { OrgSelector } from "@/app/[lang]/(pages)/app/(commons)/_layout/sidebar/orgSelector.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { cn } from "@/lib/utils";
import { getFromLocalStorage } from "@/utils/localStorage";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaHome, FaUsers } from "react-icons/fa";
import { FaBoxesPacking, FaHouseChimneyUser, FaUserNurse } from "react-icons/fa6";
import { MdSettings } from "react-icons/md";

const BASE_LIST_ITEM_CLASSES =
    "w-full py-2 px-4 flex items-center gap-3 text-slate-900 font-medium text-sm border-[1px] border-transparent rounded-md cursor-pointer";

const BASE_LIST_ITEM_HOVER_CLASSES = "hover:bg-slate-100 hover:border-slate-300";
const BASE_LIST_ITEM_ACTIVE_CLASSES =
    "text-relif-orange-200 bg-relif-orange-200/10 border-[1px] border-relif-orange-200/30";

const Sidebar = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();
    const currentUser = getFromLocalStorage("r_ud");

    const organizationID = pathname.split("/")[3];
    const activeOption = pathname.split("/")[4] ?? "home";
    const currentLanguage = pathname.split("/")[1];

    return (
        <nav className="row-span-2 w-[250px] h-[calc(100vh-32px)] bg-slate-50 pr-4 flex flex-col gap-5 lg:hidden">
            <div className="h-[49px] p-2">
                <Image
                    src="/images/logo-relif-black.svg"
                    alt="Logo Relif Black"
                    width={126}
                    height={41}
                />
            </div>

            {currentUser?.organization.type === "COORDINATOR" && platformRole === "ORG_ADMIN" && (
                <OrgSelector />
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
                    >
                        <MdSettings size={15} />
                        {dict.sidebar.preferences}
                    </li>
                </Link>
            </ul>
        </nav>
    );
};

export { Sidebar };
