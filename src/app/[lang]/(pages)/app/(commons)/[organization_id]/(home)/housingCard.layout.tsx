"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HousingSchema } from "@/types/housing.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { SlOptions } from "react-icons/sl";

type Props = HousingSchema & {
    refreshList?: () => void;
};

const HousingCard = ({ refreshList, ...data }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    const getStatus = () => {
        const availableVacancies = data.total_vacancies - data.occupied_vacancies;

        if (availableVacancies < 0) {
            return "OVERCROWDED";
        }
        if (availableVacancies > 0) {
            return "AVAILABLE";
        }
        return "FULL";
    };

    const status = getStatus();

    const percentageOccupiedVacancies = (
        (data.occupied_vacancies * 100) /
        data.total_vacancies
    )?.toFixed(0);

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 gap-4">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{data?.name}</span>
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                        {data.occupied_vacancies} beneficiaries (
                        {percentageOccupiedVacancies === "NaN" ? 0 : percentageOccupiedVacancies}%
                        occupied)
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                        {data.total_rooms > 0 ? (
                            <>
                                {status === "FULL" && (
                                    <span>
                                        <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-950">
                                            {dict.commons.home.full}
                                        </Badge>
                                    </span>
                                )}
                                {status === "AVAILABLE" && (
                                    <span>
                                        <Badge className="bg-green-500 text-slate-50 hover:bg-green-600">
                                            {dict.commons.home.available} (
                                            {data.total_vacancies - data.occupied_vacancies}{" "}
                                            {dict.commons.home.availableBeds})
                                        </Badge>
                                    </span>
                                )}

                                {status === "OVERCROWDED" && (
                                    <span>
                                        <Badge className="bg-red-600 text-slate-50 hover:bg-red-700">
                                            {dict.commons.home.overcrowded}
                                        </Badge>
                                    </span>
                                )}
                            </>
                        ) : (
                            <span>
                                <Badge className="bg-gray-400 text-slate-50 hover:bg-red-700">
                                    {dict.housingList.statusNoRooms}
                                </Badge>
                            </span>
                        )}
                    </span>
                </div>
            </div>
            <div className="flex flex-col items-end justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href={`${urlPath}/housings/${data?.id}`}>
                                {dict.commons.home.viewHousing}
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
};

export { HousingCard };
