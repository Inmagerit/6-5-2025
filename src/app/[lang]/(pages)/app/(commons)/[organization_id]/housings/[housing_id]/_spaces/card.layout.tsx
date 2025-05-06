"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SpaceSchema } from "@/types/space.types";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";

import { EditSpace } from "./edit.layout";
import { ViewSpace } from "./overview.layout";
import { RemoveSpaceModal } from "./remove.modal";

type Props = SpaceSchema & {
    refreshList: () => void;
};

const SpaceCard = ({ refreshList, ...data }: Props): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [viewSheetOpenState, setViewSheetOpenState] = useState(false);
    const [editSheetOpenState, setEditSheetOpenState] = useState(false);
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

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

    const statusColor =
        // eslint-disable-next-line no-nested-ternary
        status === "AVAILABLE" ? "green-500" : status === "FULL" ? "red-600" : "slate-900";

    return (
        <li
            className={cn(
                "w-full h-max p-4 border-b-[1px] border-b-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 border-l-[8px] lg:gap-4",
                `border-l-${statusColor}`
            )}
        >
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{data?.name}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 mt-1 flex items-center gap-1 flex-wrap">
                        {data?.occupied_vacancies || 0}/{data.total_vacancies || 0}{" "}
                        {dict.housingOverview.occupiedBeds}
                    </span>
                    {status === "FULL" && (
                        <span>
                            <Badge className="bg-slate-900 text-slate-50 hover:bg-slate-950">
                                {dict.housingList.statusFull}
                            </Badge>
                        </span>
                    )}
                    {status === "AVAILABLE" && (
                        <span>
                            <Badge className="bg-green-500 text-slate-50 hover:bg-green-600">
                                {dict.housingList.statusAvailable}
                            </Badge>
                        </span>
                    )}

                    {status === "OVERCROWDED" && (
                        <span>
                            <Badge className="bg-red-600 text-slate-50 hover:bg-red-700">
                                {dict.housingList.statusOvercrowded}
                            </Badge>
                        </span>
                    )}
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
                        <DropdownMenuItem onClick={() => setViewSheetOpenState(true)}>
                            {dict.housingOverview.dropdownViewSpace}
                        </DropdownMenuItem>
                        {platformRole === "ORG_ADMIN" && (
                            <>
                                <DropdownMenuItem onClick={() => setEditSheetOpenState(true)}>
                                    <span className="flex items-center gap-2">
                                        <FaEdit className="text-xs" />
                                        {dict.housingOverview.dropdownEditSpace}
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setRemoveDialogOpenState(true)}>
                                    <span className="flex items-center gap-2">
                                        <FaTrash className="text-xs" />
                                        {dict.housingOverview.dropdownRemoveSpace}
                                    </span>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ViewSpace
                space={data}
                sheetOpenState={viewSheetOpenState}
                setSheetOpenState={setViewSheetOpenState}
            />

            <EditSpace
                space={data}
                refreshList={refreshList}
                sheetOpenState={editSheetOpenState}
                setSheetOpenState={setEditSheetOpenState}
            />

            <RemoveSpaceModal
                space={data}
                refreshList={refreshList}
                removeDialogOpenState={removeDialogOpenState}
                setRemoveDialogOpenState={setRemoveDialogOpenState}
            />
        </li>
    );
};

export { SpaceCard };
