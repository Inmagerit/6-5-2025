"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OrganizationSchema } from "@/types/organization.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { MdBlock } from "react-icons/md";

import { DisableModal } from "../_components/disable.modal";

type Props = OrganizationSchema;

const Toolbar = (organization: Props): ReactNode => {
    const dict = useDictionary();

    const [disableDialogOpenState, setDisableDialogOpenState] = useState(false);

    const pathname = usePathname();
    const backToListPath = pathname.split("/").slice(0, 5).join("/");

    return (
        <div className="w-full h-max flex justify-between items-center">
            <Button size="sm" variant="secondary" asChild>
                <Link href={backToListPath}>
                    {dict.admin.organizations.organizationId.toolbar.backToList}
                </Link>
            </Button>

            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                size="sm"
                                variant="icon"
                                className="w-7 h-7 p-0 flex items-center justify-center"
                                onClick={() => setDisableDialogOpenState(true)}
                            >
                                <MdBlock />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {dict.admin.organizations.organizationId.toolbar.disableAccess}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <DisableModal
                organization={organization}
                disableDialogOpenState={disableDialogOpenState}
                setDisableDialogOpenState={setDisableDialogOpenState}
            />
        </div>
    );
};

export { Toolbar };
