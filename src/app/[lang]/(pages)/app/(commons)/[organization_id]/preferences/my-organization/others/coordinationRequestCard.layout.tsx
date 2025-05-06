"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = UpdateOrganizationTypeRequestSchema;

const CoordinationRequestCard = (request: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const locale = pathname.split("/")[1] as "en" | "es" | "pt";

    const statusColor =
        // eslint-disable-next-line no-nested-ternary
        request.status === "ACCEPTED"
            ? "bg-green-500 text-white hover:bg-green-600"
            : request.status === "REJECTED"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-yellow-400 text-slate-900 hover:bg-yellow-600";

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex gap-4">
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-medium">
                        {
                            dict.commons.preferences.myOrganization.others.coordination.card
                                .requestedAt
                        }{" "}
                        {formatDate(request.created_at, locale || "en")}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2 mt-2">
                        {
                            dict.commons.preferences.myOrganization.others.coordination.card
                                .currentStatus
                        }
                        : <Badge className={statusColor}>{request.status}</Badge>
                    </span>
                    {request.status === "REJECTED" && (
                        <span className="text-xs text-slate-500 mt-1">
                            <strong>
                                {
                                    dict.commons.preferences.myOrganization.others.coordination.card
                                        .rejectReason
                                }
                                :{" "}
                            </strong>
                            {request.reject_reason}
                        </span>
                    )}
                </div>
            </div>
        </li>
    );
};

export { CoordinationRequestCard };
