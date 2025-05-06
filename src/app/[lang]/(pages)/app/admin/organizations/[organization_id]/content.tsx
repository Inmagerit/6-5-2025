"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { findOrganizationByID } from "@/repository/organization.repository";
import { OrganizationSchema } from "@/types/organization.types";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaHouseChimneyUser, FaUsers } from "react-icons/fa6";
import { MdError } from "react-icons/md";

import { HousingList } from "./_housing/list.layout";
import { UserList } from "./_users/list.layout";
import { Toolbar } from "./toolbar.layout";

type Props = {
    organizationId: string;
};

const Content = ({ organizationId }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const [data, setData] = useState<OrganizationSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                setError(false);

                const response = await findOrganizationByID(organizationId);
                setData(response.data);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (platformRole !== "RELIF_MEMBER") return <div />;

    if (isLoading)
        return (
            <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                {dict.admin.organizations.organizationId.content.loading}
            </h2>
        );

    if (!isLoading && error)
        return (
            <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                <MdError />
                {dict.admin.organizations.organizationId.content.error}
            </span>
        );

    if (data) {
        return (
            <div className="p-2 w-full h-max flex flex-col gap-2">
                <div className="w-full h-max p-4 rounded-lg border border-dashed border-relif-orange-200">
                    <div className="flex flex-col w-full">
                        <Toolbar {...data} />
                        <h1 className="text-slate-900 font-bold text-2xl mt-6 pb-6 flex items-center gap-4">
                            <FaHouseChimneyUser />
                            {data?.name}
                        </h1>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {`${data?.address.address_line_1}, ${data?.address.address_line_2} - ${data?.address.city}, ${data?.address.district} | ${data?.address.zip_code} - ${data?.address.country}`}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            {dict.admin.organizations.organizationId.content.createdAt}{" "}
                            {formatDate(data?.created_at, locale || "en")}
                        </span>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 lg:flex lg:flex-col">
                    <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
                        <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaUsers />
                            {dict.admin.organizations.organizationId.content.users}
                        </h3>
                        {/* <div className="flex items-center gap-2"> */}
                        {/*    <MdSearch className="text-slate-400 text-2xl" /> */}
                        {/*    <Input type="text" placeholder="Search" className="w-full h-8" /> */}
                        {/* </div> */}
                        <UserList organizationId={organizationId} />
                    </div>
                    <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
                        <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                            <FaHouseChimneyUser />
                            {dict.admin.organizations.organizationId.content.housings}
                        </h3>
                        {/* <div className="flex items-center gap-2"> */}
                        {/*    <MdSearch className="text-slate-400 text-2xl" /> */}
                        {/*    <Input type="text" placeholder="Search" className="w-full h-8" /> */}
                        {/* </div> */}
                        <HousingList organizationId={organizationId} />
                    </div>
                </div>
            </div>
        );
    }

    return <div />;
};

export { Content };
