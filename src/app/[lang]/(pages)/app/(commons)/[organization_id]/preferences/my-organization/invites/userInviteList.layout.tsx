"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { findJoinRequestsByOrganizationId } from "@/repository/organization.repository";
import { JoinOrganizationRequestSchema } from "@/types/requests.types";
import { UserSchema } from "@/types/user.types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { UserInvite } from "./userInvite.layout";

const UserInviteList = (): ReactNode => {
    const dict = useDictionary();

    const [invites, setInvites] = useState<{
        count: number;
        data: JoinOrganizationRequestSchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getInvites = async () => {
        setIsLoading(true);
        setError(false);

        const currentUser: UserSchema = await getFromLocalStorage("r_ud");
        const organizationId = currentUser.organization_id;

        if (organizationId) {
            const OFFSET = 0;
            const LIMIT = 9999;
            const response = await findJoinRequestsByOrganizationId(organizationId, OFFSET, LIMIT);

            setInvites({
                count:
                    response.data.data?.filter(
                        invite => invite.status === "PENDING" && invite.user_id !== currentUser.id
                    ).length || 0,
                data:
                    response.data.data?.filter(
                        invite => invite.status === "PENDING" && invite.user_id !== currentUser.id
                    ) || [],
            });
        } else {
            throw new Error();
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await getInvites();
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
                        {dict.commons.preferences.myOrganization.invites.user.list.loading}
                    </span>
                </div>
            )}

            {!error && !isLoading && invites?.count === 0 && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-slate-900 font-medium">
                        {dict.commons.preferences.myOrganization.invites.user.list.noInvitations}
                    </span>
                </div>
            )}

            {error && !isLoading && (
                <div className="w-full h-full flex flex-col gap-2 p-2">
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                        <MdError />
                        {dict.commons.preferences.myOrganization.invites.user.list.error}
                    </span>
                </div>
            )}

            {!error && !isLoading && invites?.count && invites?.count > 0 && (
                <ul className="w-full h-full flex flex-col gap-2 p-2 overflow-x-hidden overflow-y-scroll">
                    {invites?.data.map(invite => (
                        <UserInvite {...invite} refreshList={getInvites} />
                    ))}
                </ul>
            )}
        </>
    );
};

export { UserInviteList };
