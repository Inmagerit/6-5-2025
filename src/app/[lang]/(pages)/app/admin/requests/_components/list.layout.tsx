"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { findRequests } from "@/repository/updateOrganizationTypeRequests.repository";
import { UpdateOrganizationTypeRequestSchema } from "@/types/requests.types";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { Card } from "./card.layout";

const RequestList = (): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [requests, setRequests] = useState<{
        count: number;
        data: UpdateOrganizationTypeRequestSchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const LIMIT = 9999;
    const OFFSET = 0;

    const getOrganizationList = async () => {
        try {
            const response = await findRequests(OFFSET, LIMIT);
            setRequests(response.data);
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        getOrganizationList();
    }, []);

    if (platformRole !== "RELIF_MEMBER") return <div />;

    return (
        <div className="h-[calc(100vh-115px)] lg:h-[calc(100vh-83px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
            {isLoading && (
                <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                    {dict.admin.requests.list.loading}
                </h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                    <MdError />
                    {dict.admin.requests.list.error}
                </span>
            )}

            {!isLoading && !error && requests && requests.data.length <= 0 && (
                <span className="text-sm text-slate-900 font-medium p-4">
                    {dict.admin.requests.list.noRequests}
                </span>
            )}

            {!isLoading && !error && requests && requests.data.length > 0 && (
                <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                    {requests?.data.map(request => (
                        <Card key={request.id} {...request} refreshList={getOrganizationList} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export { RequestList };
