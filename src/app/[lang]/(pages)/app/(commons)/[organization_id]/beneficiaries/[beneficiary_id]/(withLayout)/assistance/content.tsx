"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import {
    getBeneficiaryById,
    getDonationsByBeneficiaryId,
} from "@/repository/beneficiary.repository";
import { BeneficiarySchema, Donation } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaCartPlus, FaMapMarkerAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { LuHelpingHand } from "react-icons/lu";
import { MdError } from "react-icons/md";

type Props = {
    beneficiaryId: string;
};

const Content = ({ beneficiaryId }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const [beneficiary, setBeneficiary] = useState<BeneficiarySchema | null>(null);
    const [assistances, setAssistances] = useState<{
        data: Donation[];
        count: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);

                const OFFSET = 0;
                const LIMIT = 9999;

                if (beneficiaryId) {
                    const responseBeneficiary = await getBeneficiaryById(beneficiaryId);
                    setBeneficiary(responseBeneficiary.data);

                    const { data: donations } = await getDonationsByBeneficiaryId(
                        beneficiaryId,
                        OFFSET,
                        LIMIT
                    );
                    setAssistances(donations);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading)
        return (
            <h2 className="text-relif-orange-400 font-medium text-sm p-4">
                {dict.commons.beneficiaries.beneficiaryId.assistance.loading}
            </h2>
        );

    if (error)
        return (
            <span className="p-4 text-sm text-red-600 font-medium flex items-center gap-1">
                <MdError />
                {dict.commons.beneficiaries.beneficiaryId.assistance.error}
            </span>
        );

    if (beneficiary) {
        return (
            <div>
                <div className="w-ful h-max p-4 rounded-lg bg-relif-orange-500">
                    <div className="flex flex-col">
                        <span className="text-white font-bold text-base pb-2 flex items-center gap-2">
                            <FaUsers size={15} />
                            {convertToTitleCase(beneficiary.full_name)}
                        </span>
                        <span className="text-xs text-slate-50 flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {beneficiary?.current_housing_id ? (
                                <>
                                    {convertToTitleCase(beneficiary?.current_housing.name)} |{" "}
                                    {
                                        dict.commons.beneficiaries.beneficiaryId.assistance
                                            .currentlyInSpace
                                    }{" "}
                                    <strong>{beneficiary?.current_room.name}</strong>
                                </>
                            ) : (
                                "Unallocated"
                            )}
                        </span>
                    </div>
                </div>
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg p-4 mt-2">
                    <h1 className="text-relif-orange-200 text-xl font-bold flex items-center gap-2 mb-4">
                        <LuHelpingHand size={28} />
                        {dict.commons.beneficiaries.beneficiaryId.assistance.assistanceReceived}
                    </h1>
                    {assistances?.count !== 0 ? (
                        <ul className="h-[calc(100vh-325px)] overflow-x-hidden overflow-y-scroll">
                            {assistances?.data.map(assistance => (
                                <li className="w-full flex border border-slate-200 rounded-md p-4 flex-col gap-1 mt-2">
                                    <span className="text-sm text-slate-900 flex items-center gap-2">
                                        {formatDate(assistance.created_at, locale || "en")}
                                    </span>
                                    <span></span>
                                    <span className="text-sm text-slate-900">
                                        <strong>
                                            {
                                                dict.commons.beneficiaries.beneficiaryId.assistance
                                                    .from
                                            }
                                            :
                                        </strong>{" "}
                                        {assistance.from?.name}
                                    </span>
                                    <span className="w-full flex items-center gap-2 text-sm text-relif-orange-200 font-bold border-t-[1px] border-dashed border-slate-200 mt-2 pt-2">
                                        <FaCartPlus />
                                        {
                                            dict.commons.beneficiaries.beneficiaryId.assistance
                                                .product
                                        }
                                    </span>
                                    <span className="flex flex-col mt-2 gap-1 text-xs text-slate-500">
                                        {assistance.quantity}x | {assistance.product_type.name} -{" "}
                                        {assistance.product_type.brand}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="h-[calc(100vh-325px)]">
                            <span className="text-sm text-slate-900 font-medium">
                                {
                                    dict.commons.beneficiaries.beneficiaryId.assistance
                                        .noAssistancesFound
                                }
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return <div />;
};

export { Content };
