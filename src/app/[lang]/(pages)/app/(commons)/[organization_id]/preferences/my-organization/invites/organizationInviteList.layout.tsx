"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { findDataAccessRequestsByOrganizationId } from "@/repository/organization.repository";
import { OrganizationDataAccessRequestSchema } from "@/types/organization.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { OrganizationInvite } from "./organizationInvite.layout";

const OrganizationInviteList = (): ReactNode => {
    const dict = useDictionary();

    const [requests, setRequests] = useState<{
        count: number;
        data: OrganizationDataAccessRequestSchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getRequests = async () => {
        setIsLoading(true);
        setError(false);

        const currentUser: UserSchema = await getFromLocalStorage("r_ud");
        const organizationId = currentUser.organization_id;

        if (organizationId) {
            const OFFSET = 0;
            const LIMIT = 9999;
            const response = await findDataAccessRequestsByOrganizationId(
                organizationId,
                OFFSET,
                LIMIT
            );

            setRequests(response.data);
        } else {
            throw new Error();
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                await getRequests();
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <>
            {isLoading && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-relif-orange-400 font-medium">
                        {dict.commons.preferences.myOrganization.invites.organization.list.loading}
                    </span>
                </div>
            )}

            {!error && !isLoading && requests?.count === 0 && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-slate-900 font-medium">
                        {
                            dict.commons.preferences.myOrganization.invites.organization.list
                                .noRequests
                        }
                    </span>
                </div>
            )}

            {error && !isLoading && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <MdError />
                        {dict.commons.preferences.myOrganization.invites.organization.list.error}
                    </span>
                </div>
            )}

            {!error && !isLoading && requests?.count && requests?.count > 0 && (
                <ul className="w-full h-full flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-scroll">
                    {requests?.data.map(request => (
                        <OrganizationInvite {...request} refreshList={getRequests} />
                    ))}
                </ul>
            )}
        </>
    );
};

export { OrganizationInviteList };
