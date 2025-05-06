"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { Dispatch, ReactNode, SetStateAction } from "react";

import { CoordinationRequestCard } from "./coordinationRequestCard.layout";

type Props = {
    requests: { count: number; data: UpdateOrganizationTypeRequestSchema[] };
    sheetOpenState: boolean;
    setSheetOpenState: Dispatch<SetStateAction<boolean>>;
};

const CoordinationRequestHistoric = ({
    requests,
    sheetOpenState,
    setSheetOpenState,
}: Props): ReactNode => {
    const dict = useDictionary();

    return (
        <Sheet open={sheetOpenState} onOpenChange={setSheetOpenState}>
            <SheetContent className="py-4 px-4 lg:w-full">
                <SheetHeader>
                    <SheetTitle>
                        {
                            dict.commons.preferences.myOrganization.others.coordination.historic
                                .requestHistory
                        }
                    </SheetTitle>
                </SheetHeader>
                <div className="border border-slate-200 rounded-lg overflow-hidden h-[calc(100vh-77px)] mt-5">
                    {requests.count === 0 && (
                        <span className="text-sm text-slate-900 font-medium p-4 block">
                            {
                                dict.commons.preferences.myOrganization.others.coordination.historic
                                    .noRequestsFound
                            }
                        </span>
                    )}

                    {requests.count > 0 && (
                        <ul className="w-full h-[calc(100vh-77px)] overflow-x-hidden overflow-y-scroll">
                            {requests.data.map(request => (
                                <CoordinationRequestCard {...request} />
                            ))}
                        </ul>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export { CoordinationRequestHistoric };
