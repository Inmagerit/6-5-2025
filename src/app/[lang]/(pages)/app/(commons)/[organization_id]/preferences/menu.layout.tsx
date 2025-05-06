"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaBuildingUser, FaClipboardUser, FaSitemap } from "react-icons/fa6";

const BASE_LIST_ITEM_CLASSES =
    "w-full py-2 px-4 flex items-center gap-3 text-slate-900 font-medium text-sm border-[1px] border-transparent rounded-md cursor-pointer";
const BASE_LIST_ITEM_HOVER_CLASSES = "hover:bg-slate-100 hover:border-slate-300";
const BASE_LIST_ITEM_ACTIVE_CLASSES =
    "text-relif-orange-200 bg-relif-orange-200/10 border-[1px] border-relif-orange-200/30";

const Menu = (): ReactNode => {
    const dict = useDictionary();
    const pathname = usePathname();
    const activeOption = pathname.split("/")[5] ?? "platform";
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    return (
        <div className="w-full h-full rounded-md border-[1px] border-slate-200 bg-slate-50 p-2 lg:h-max">
            <ul className="flex flex-col gap-1">
                <Link href={`${urlPath}/platform`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "platform"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <FaSitemap size={15} />
                        {dict.commons.preferences.menu.platform}
                    </li>
                </Link>

                <Link href={`${urlPath}/my-organization/overview`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "my-organization"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <FaBuildingUser size={15} />
                        {dict.commons.preferences.menu.myOrganization}
                    </li>
                </Link>

                <Link href={`${urlPath}/my-profile`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "my-profile"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <FaClipboardUser size={15} />
                        {dict.commons.preferences.menu.myProfile}
                    </li>
                </Link>

                <Link href={`${urlPath}/support`}>
                    <li
                        className={cn(
                            BASE_LIST_ITEM_CLASSES,
                            activeOption !== "support"
                                ? BASE_LIST_ITEM_HOVER_CLASSES
                                : BASE_LIST_ITEM_ACTIVE_CLASSES
                        )}
                    >
                        <FaInfoCircle size={15} />
                        {dict.commons.preferences.menu.support}
                    </li>
                </Link>
            </ul>
        </div>
    );
};

export { Menu };
