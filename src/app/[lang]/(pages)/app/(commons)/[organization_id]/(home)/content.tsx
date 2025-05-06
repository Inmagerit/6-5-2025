"use client";

import { HousingCard } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/(home)/housingCard.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import {
    findHousingsByOrganizationId,
    getBeneficiariesByOrganizationID,
    getProductsByOrganizationID,
    getVoluntariesByOrganizationID,
} from "@/repository/organization.repository";
import { HousingSchema } from "@/types/housing.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaBoxes } from "react-icons/fa";
import { FaHouseChimneyUser, FaUserNurse, FaUsers } from "react-icons/fa6";

const Content = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const organizationId = pathname.split("/")[3];

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const [housings, setHousings] = useState<HousingSchema[] | []>([]);
    const [beneficiaries, setBeneficiaries] = useState(0);
    const [volunteers, setVolunteers] = useState(0);
    const [products, setProducts] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const OFFSET = 0;
                const LIMIT = 9999;

                setIsLoading(true);
                setError(false);

                const promises = [
                    await findHousingsByOrganizationId(organizationId, OFFSET, LIMIT, ""),
                    await getBeneficiariesByOrganizationID(organizationId, OFFSET, LIMIT, ""),
                    await getVoluntariesByOrganizationID(organizationId, OFFSET, LIMIT, ""),
                    await getProductsByOrganizationID(organizationId, OFFSET, LIMIT, ""),
                ];

                const [
                    housingsResponse,
                    beneficiariesResponse,
                    volunteersResponse,
                    productsResponse,
                ] = await Promise.all(promises);

                if (!housingsResponse.data) throw new Error();
                if (!beneficiariesResponse.data) throw new Error();
                if (!volunteersResponse.data) throw new Error();
                if (!productsResponse.data) throw new Error();

                setHousings(housingsResponse.data.data as HousingSchema[]);
                setBeneficiaries(beneficiariesResponse.data.count);
                setVolunteers(volunteersResponse.data.count);
                setProducts(productsResponse.data.count);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <div className="p-4 lg:p-2">
            <div className="flex flex-col gap-4 p-6 border border-slate-200 rounded-xl lg:p-3">
                <div className="w-full h-max p-6 border border-dashed border-relif-orange-200 rounded-lg lg:p-3">
                    <h1 className="text-3xl text-center text-relif-orange-200 font-bold">
                        {dict.commons.home.welcomeToRelif}
                    </h1>
                    <h2 className="text-base text-slate-500 font-medium text-center">
                        {dict.commons.home.briefOverview}
                    </h2>
                </div>
                <div className="w-full grid grid-cols-4 gap-4 lg:flex lg:flex-wrap">
                    <div className="w-full h-max rounded-lg bg-relif-orange-200 overflow-hidden flex flex-col">
                        <div className="w-full py-1 px-5 bg-relif-orange-300 lg:p-3">
                            <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                                <FaHouseChimneyUser />
                                {dict.commons.home.housings}
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-3xl text-white font-bold lg:text-2xl">
                                {housings.length || 0}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-max rounded-lg bg-relif-orange-200 overflow-hidden flex flex-col">
                        <div className="w-full py-1 px-5 bg-relif-orange-300 lg:p-3">
                            <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                                <FaUsers />
                                {convertToTitleCase(dict.commons.home.beneficiaries)}
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-3xl text-white font-bold lg:text-2xl">
                                {beneficiaries || 0}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-max rounded-lg bg-relif-orange-200 overflow-hidden flex flex-col">
                        <div className="w-full py-1 px-5 bg-relif-orange-300 lg:p-3">
                            <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                                <FaUserNurse />
                                {dict.commons.home.volunteers}
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-3xl text-white font-bold lg:text-2xl">
                                {volunteers || 0}
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-max rounded-lg bg-relif-orange-200 overflow-hidden flex flex-col">
                        <div className="w-full py-1 px-5 bg-relif-orange-300 lg:p-3">
                            <span className="h-full text-white font-bold flex items-center justify-center gap-3">
                                <FaBoxes />
                                {dict.commons.home.products}
                            </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <span className="text-3xl text-white font-bold lg:text-2xl">
                                {products || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[calc(100vh-390px)] border border-slate-200 rounded-lg mt-4 overflow-hidden">
                <h3 className="text-slate-900 font-bold text-base p-4 bg-slate-50/50 flex items-center gap-2 border-b border-slate-200">
                    <FaHouseChimneyUser />
                    {dict.commons.home.occupancyRate}
                </h3>
                <ul className="w-full h-full overflow-x-hidden overflow-y-scroll">
                    {housings?.map(housing => <HousingCard key={housing.id} {...housing} />)}
                </ul>
            </div>
        </div>
    );
};

export { Content };
