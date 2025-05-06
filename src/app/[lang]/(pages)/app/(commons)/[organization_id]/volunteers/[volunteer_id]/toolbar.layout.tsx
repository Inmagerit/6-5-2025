"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VoluntarySchema } from "@/types/voluntary.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

import { RemoveModal } from "../_components/remove.modal";

type Props = {
    volunteer: VoluntarySchema;
};

const Toolbar = ({ volunteer }: Props): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();
    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const backToListPath = pathname.split("/").slice(0, 5).join("/");
    const editPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <div className="w-full h-max flex justify-between items-center">
            <Button size="sm" variant="secondary" asChild>
                <Link href={backToListPath}>
                    {dict.commons.volunteers.volunteerId.toolbar.backToList}
                </Link>
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
                                <TooltipContent>
                                    {dict.commons.volunteers.volunteerId.toolbar.editVolunteer}
                                </TooltipContent>
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
                                    {dict.commons.volunteers.volunteerId.toolbar.removeVolunteer}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <RemoveModal
                        volunteer={volunteer}
                        removeDialogOpenState={removeDialogOpenState}
                        setRemoveDialogOpenState={setRemoveDialogOpenState}
                    />
                </>
            )}
        </div>
    );
};

export { Toolbar };
