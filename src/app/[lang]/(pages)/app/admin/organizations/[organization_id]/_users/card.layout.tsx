"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserSchema } from "@/types/user.types";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { MdAccessTime, MdMail } from "react-icons/md";

type Props = UserSchema;

const UserCard = (data: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";
    const initials = data?.first_name?.charAt(0)?.concat(data?.last_name?.charAt(0));

    return (
        <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md lg:flex-col">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarFallback className="bg-relif-orange-400 text-white font-semibold text-sm">
                        {initials || "US"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        {data?.first_name} {data?.last_name}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <MdMail />
                        {data?.email}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <MdAccessTime />
                        {dict.admin.organizations.organizationId.users.card.createdAt}{" "}
                        {formatDate(data?.created_at, locale || "en")}
                    </span>
                </div>
            </div>

            <div className="flex flex-col lg:mt-3">
                <span>
                    <Badge>
                        {data?.platform_role ||
                            dict.admin.organizations.organizationId.users.card.member}
                    </Badge>
                </span>
            </div>
        </li>
    );
};

export { UserCard };
