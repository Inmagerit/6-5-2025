"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";

import { MoveModal } from "../../_components/move.modal";
import { RemoveModal } from "../../_components/remove.modal";

type Props = {
    beneficiary: BeneficiarySchema;
};

const Toolbar = ({ beneficiary }: Props): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [removeDialogOpenState, setRemoveDialogOpenState] = useState(false);
    const [moveDialogOpenState, setMoveDialogOpenState] = useState(false);

    const pathname = usePathname();
    const backToListPath = pathname.split("/").slice(0, 5).join("/");
    const editPath = pathname.split("/").slice(0, 6).join("/");

    return (
        <div className="w-full h-max flex justify-between items-center">
            <Button size="sm" variant="secondary" asChild>
                <Link href={backToListPath}>
                    {dict.commons.beneficiaries.beneficiaryId.toolbar.backToListButton}
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
                                    {
                                        dict.commons.beneficiaries.beneficiaryId.toolbar
                                            .editBeneficiaryTooltip
                                    }
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
                                        onClick={() => setMoveDialogOpenState(true)}
                                    >
                                        <IoMdMove />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {
                                        dict.commons.beneficiaries.beneficiaryId.toolbar
                                            .moveBeneficiaryTooltip
                                    }
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
                                    {
                                        dict.commons.beneficiaries.beneficiaryId.toolbar
                                            .removeBeneficiaryTooltip
                                    }
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <RemoveModal
                        beneficiary={beneficiary}
                        removeDialogOpenState={removeDialogOpenState}
                        setRemoveDialogOpenState={setRemoveDialogOpenState}
                    />

                    <MoveModal
                        beneficiary={beneficiary}
                        moveDialogOpenState={moveDialogOpenState}
                        setMoveDialogOpenState={setMoveDialogOpenState}
                    />
                </>
            )}
        </div>
    );
};

export { Toolbar };
