"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { FaSitemap, FaUsers } from "react-icons/fa6";

const BASE_LIST_ITEM_CLASSES =
    "w-full py-2 px-4 flex items-center gap-3 text-slate-900 font-medium text-sm border-[1px] border-transparent rounded-md cursor-pointer";
const BASE_LIST_ITEM_HOVER_CLASSES = "hover:bg-slate-100 hover:border-slate-300";
const BASE_LIST_ITEM_ACTIVE_CLASSES =
    "text-relif-orange-200 bg-relif-orange-200/10 border-[1px] border-relif-orange-200/30";

const Menu = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();
    const activeOption = pathname.split("/")[5] ?? "platform";

    return (
        <div className="w-full h-full rounded-md border-[1px] border-slate-200 bg-slate-50 p-2 lg:h-max">
            {platformRole === "RELIF_MEMBER" && (
                <ul className="flex flex-col gap-1">
                    <Link href="/app/admin/preferences/platform">
                        <li
                            className={cn(
                                BASE_LIST_ITEM_CLASSES,
                                activeOption !== "platform"
                                    ? BASE_LIST_ITEM_HOVER_CLASSES
                                    : BASE_LIST_ITEM_ACTIVE_CLASSES
                            )}
                        >
                            <FaSitemap size={15} />
                            {dict.admin.preferences.menu.platform}
                        </li>
                    </Link>

                    <Link href="/app/admin/preferences/users">
                        <li
                            className={cn(
                                BASE_LIST_ITEM_CLASSES,
                                activeOption !== "users"
                                    ? BASE_LIST_ITEM_HOVER_CLASSES
                                    : BASE_LIST_ITEM_ACTIVE_CLASSES
                            )}
                        >
                            <FaUsers size={15} />
                            {dict.admin.preferences.menu.users}
                        </li>
                    </Link>
                </ul>
            )}
        </div>
    );
};

export { Menu };
