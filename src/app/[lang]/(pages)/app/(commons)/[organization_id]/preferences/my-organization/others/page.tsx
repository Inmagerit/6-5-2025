"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { findUpdateOrganizationTypeRequestsByOrganizationId } from "@/repository/organization.repository";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { UserSchema } from "@/types/user.types";
import { formatDate } from "@/utils/formatDate";
import { getFromLocalStorage } from "@/utils/localStorage";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { CoordinationRequestDialog } from "./coordinationRequestDialog.layout";
import { CoordinationRequestHistoric } from "./coordinationRequestHistoric.layout";
import OrganizationToken from "./organizationToken.layout";
import RequestDataAccess from "./requestDataAccess.layout";

export default function Page(): ReactNode {
    const pathname = usePathname();
    const dict = useDictionary();

    const [data, setData] = useState<{
        count: number;
        data: UpdateOrganizationTypeRequestSchema[];
    } | null>(null);
    const [isCoordination, setIsCoordination] =
        useState<UpdateOrganizationTypeRequestSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [sheetOpenState, setSheetOpenState] = useState(false);

    const locale = pathname.split("/")[1] as "es" | "en" | "pt";

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const currentUser: UserSchema = await getFromLocalStorage("r_ud");

                const OFFSET = 0;
                const LIMIT = 9999;
                const { data: orgTypeRequests } =
                    await findUpdateOrganizationTypeRequestsByOrganizationId(
                        currentUser.organization_id as string,
                        OFFSET,
                        LIMIT
                    );
                setData(orgTypeRequests);

                if (orgTypeRequests && orgTypeRequests.count > 0) {
                    setIsCoordination(
                        orgTypeRequests.data.find(item => item.status === "ACCEPTED") || null
                    );
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [sheetOpenState]);

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium">
                {dict.commons.preferences.myOrganization.others.page.loading}
            </h2>
        );

    if (error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.commons.preferences.myOrganization.others.page.error}
            </span>
        );

    if (data) {
        return (
            <div className="flex flex-col gap-4 w-full h-[calc(100vh-260px)] mt-4">
                {!isCoordination ? (
                    <div className="border-[1px] border-relif-orange-200 rounded-md w-full h-max p-4">
                        <h2 className="text-base font-bold text-relif-orange-200 pb-1">
                            {
                                dict.commons.preferences.myOrganization.others.page
                                    .coordinatingOrganization
                            }
                        </h2>
                        <p className="text-sm text-slate-900 mb-5">
                            {
                                dict.commons.preferences.myOrganization.others.page
                                    .coordinatingOrganizationDescription
                            }
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <CoordinationRequestDialog>
                                <Button>
                                    {
                                        dict.commons.preferences.myOrganization.others.page
                                            .requestToBeCoordinatingOrganization
                                    }
                                </Button>
                            </CoordinationRequestDialog>
                            <Button variant="outline" onClick={() => setSheetOpenState(true)}>
                                {dict.commons.preferences.myOrganization.others.page.viewHistoric}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="border-[1px] border-relif-orange-200 rounded-md w-full h-max p-4">
                            <h2 className="text-base font-bold text-relif-orange-200 pb-1">
                                {
                                    dict.commons.preferences.myOrganization.others.page
                                        .alreadyCoordinatingOrganization
                                }
                            </h2>
                            <p className="text-sm text-slate-900 mb-5">
                                {
                                    dict.commons.preferences.myOrganization.others.page
                                        .coordinatingOrganizationDescription
                                }
                            </p>
                            <span className="block text-sm text-slate-500">
                                {dict.commons.preferences.myOrganization.others.page.appealAccepted}{" "}
                                {formatDate(isCoordination?.accepted_at, locale || "en")}
                            </span>
                            <span className="text-xs text-slate-500 mb-5">
                                {dict.commons.preferences.myOrganization.others.page.requestedBy}{" "}
                                {isCoordination?.creator?.first_name} (
                                {isCoordination?.creator?.email}) on{" "}
                                {formatDate(isCoordination?.created_at, locale || "en")}
                            </span>
                        </div>

                        <RequestDataAccess />
                    </>
                )}

                <OrganizationToken />
                <CoordinationRequestHistoric
                    requests={data}
                    sheetOpenState={sheetOpenState}
                    setSheetOpenState={setSheetOpenState}
                />
            </div>
        );
    }

    return <div />;
}
