"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HousingSchema } from "@/types/housing.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import { RemoveModal } from "../_components/remove.modal";

type Props = {
    housing: HousingSchema;
};

const Toolbar = ({ housing }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const backToListPath = pathname.split("/").slice(0, 5).join("/");
    const editPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <div className="w-full h-max flex justify-between items-center">
            <Button size="sm" variant="secondary" asChild>
                <Link href={backToListPath}>{dict.housingOverview.btnBack}</Link>
            </Button>

            {platformRole === "ORG_ADMIN" && (
                <>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        size="sm"
                                        variant="icon"
                                        className="w-7 h-7 p-0 flex items-center justify-center"
                                        asChild
                                    >
                                        <Link href={`${editPath}/edit`}>
                                            <FaEdit />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{dict.housingOverview.tooltipEdit}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button
                                        size="sm"
                                        variant="icon"
                                        className="w-7 h-7 p-0 flex items-center justify-center"
                                        onClick={() => setRemoveDialogOpenState(true)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {dict.housingOverview.tooltipRemove}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <RemoveModal
                        housing={housing}
                        removeDialogOpenState={removeDialogOpenState}
                        setRemoveDialogOpenState={setRemoveDialogOpenState}
                    />
                </>
            )}
        </div>
    );
};

export { Toolbar };
