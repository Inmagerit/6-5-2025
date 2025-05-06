"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { findHousingsByOrganizationId } from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { ReactNode, useEffect, useState } from "react";
import { MdError } from "react-icons/md";

import { HousingCard } from "./card.layout";

type Props = {
    organizationId: string;
};

const HousingList = ({ organizationId }: Props): ReactNode => {
    const dict = useDictionary();

    const [data, setData] = useState<{ data: HousingSchema[]; count: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const OFFSET = 0;
                const LIMIT = 9999;
                const response = await findHousingsByOrganizationId(
                    organizationId,
                    OFFSET,
                    LIMIT,
                    ""
                );
                setData(response.data);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <div className="w-full h-[calc(100vh-347px)] border border-slate-200 rounded-md overflow-hidden">
            {isLoading && (
                <h2 className="text-relif-orange-400 font-medium text-sm p-2">
                    {dict.admin.organizations.organizationId.housing.list.loading}
                </h2>
            )}

            {!isLoading && error && (
                <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-2">
                    <MdError />
                    {dict.admin.organizations.organizationId.housing.list.error}
                </span>
            )}

            {!isLoading && !error && data && data.count <= 0 && (
                <span className="text-sm text-slate-900 font-medium p-2">
                    {dict.admin.organizations.organizationId.housing.list.noHousingsFound}
                </span>
            )}

            {!isLoading && !error && data && data.count > 0 && (
                <ul className="w-full h-full overflow-x-hidden overflow-y-scroll p-2 flex flex-col gap-2">
                    {data.data?.map(housing => <HousingCard {...housing} />)}
                </ul>
            )}
        </div>
    );
};

export { HousingList };
