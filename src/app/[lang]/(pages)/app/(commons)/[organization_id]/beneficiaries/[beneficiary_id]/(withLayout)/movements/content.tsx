"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import {
    getAllocationByBeneficiaryId,
    getBeneficiaryById,
} from "@/repository/beneficiary.repository";
import { BeneficiaryAllocationSchema, BeneficiarySchema } from "@/types/beneficiary.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { ReactNode, useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { IoMdMove } from "react-icons/io";
import { MdError } from "react-icons/md";

import { Card } from "./card";

type Props = {
    beneficiaryId: string;
};

const Content = ({ beneficiaryId }: Props): ReactNode => {
    const dict = useDictionary();

    const [beneficiary, setBeneficiary] = useState<BeneficiarySchema | null>(null);
    const [allocations, setAllocations] = useState<{
        data: BeneficiaryAllocationSchema[];
        count: number;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const getBeneficiariesAllocations = async () => {
        try {
            if (beneficiaryId) {
                const OFFSET = 0;
                const LIMIT = 9999;
                const responseBeneficiary = await getBeneficiaryById(beneficiaryId);
                setBeneficiary(responseBeneficiary.data);

                const responseAllocations = await getAllocationByBeneficiaryId(
                    beneficiaryId,
                    OFFSET,
                    LIMIT
                );
                setAllocations(responseAllocations.data);
            } else {
                throw new Error();
            }
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        (async () => getBeneficiariesAllocations())();
    }, []);

    if (isLoading)
        return (
            <h2 className="text-relif-orange-400 font-medium text-sm p-4">
                {dict.commons.beneficiaries.beneficiaryId.movements.loading}
            </h2>
        );

    if (error)
        return (
            <span className="p-4 text-sm text-red-600 font-medium flex items-center gap-1">
                <MdError />
                {dict.commons.beneficiaries.beneficiaryId.movements.error}
            </span>
        );

    if (beneficiary && allocations) {
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
                                    {convertToTitleCase(beneficiary?.current_housing.name)} |
                                    {
                                        dict.commons.beneficiaries.beneficiaryId.movements
                                            .currentlyInSpace
                                    }{" "}
                                    <strong>{beneficiary?.current_room.name}</strong>
                                </>
                            ) : (
                                dict.commons.beneficiaries.beneficiaryId.movements.unallocated
                            )}
                        </span>
                    </div>
                </div>
                <div className="w-full grow border-[1px] border-slate-200 rounded-lg mt-2 h-[calc(100vh-245px)] overflow-hidden">
                    <h1 className="text-relif-orange-200 text-xl font-bold flex items-center gap-2 p-4">
                        <IoMdMove />
                        {dict.commons.beneficiaries.beneficiaryId.movements.movements}
                    </h1>

                    {allocations.count <= 0 && (
                        <span className="p-4 text-sm text-slate-900 font-medium">
                            {dict.commons.beneficiaries.beneficiaryId.movements.noAllocationsFound}
                        </span>
                    )}

                    {allocations.count > 0 && (
                        <ul className="flex flex-col h-[calc(100vh-333px)] gap-2 overflow-x-hidden overflow-y-scroll p-4">
                            {allocations.data?.map(allocation => <Card {...allocation} />)}
                        </ul>
                    )}
                </div>
            </div>
        );
    }

    return <div />;
};

export { Content };
