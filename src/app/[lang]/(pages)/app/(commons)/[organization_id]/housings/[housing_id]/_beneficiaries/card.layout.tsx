"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SlOptions } from "react-icons/sl";

type Props = BeneficiarySchema;

const BeneficiaryCard = (data: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();

    const urlPath = pathname.split("/").slice(0, 4).join("/");
    const locale = pathname.split("/")[1] as "en" | "es" | "pt";

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 lg:gap-4">
            <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-relif-orange-200 text-white">
                        {data.full_name.split(" ")[0].charAt(0).toUpperCase() || "US"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        {convertToTitleCase(data.full_name)}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        {formatDate(data.birthdate, locale || "en")}
                    </span>
                </div>
            </div>
            <div className="flex items-start">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/beneficiaries/${data.id}`}>
                                {dict.housingOverview.dropdownViewProfile}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
};

export { BeneficiaryCard };
