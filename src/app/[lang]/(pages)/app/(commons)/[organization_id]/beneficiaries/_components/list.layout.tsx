"use client";

import { Toolbar } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/beneficiaries/_components/toolbar.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { getBeneficiariesByOrganizationID } from "@/repository/organization.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { MdError, MdSearch } from "react-icons/md";

import { Card } from "./card.layout";

const BeneficiaryList = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();

    const [beneficiaries, setBeneficiaries] = useState<{
        count: number;
        data: BeneficiarySchema[];
    } | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const LIMIT = 20;

    const getHousingList = useCallback(
        async (filter: string = "") => {
            try {
                const organizationId = pathname.split("/")[3];

                if (organizationId) {
                    const response = await getBeneficiariesByOrganizationID(
                        organizationId,
                        offset,
                        LIMIT,
                        filter
                    );
                    setBeneficiaries(response.data);
                } else {
                    throw new Error();
                }
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        },
        [pathname, offset]
    );

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getHousingList(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, getHousingList]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        setIsLoading(true);
        getHousingList();
    }, [offset, getHousingList]);

    const totalPages = beneficiaries ? Math.ceil(beneficiaries.count / LIMIT) : 0;
    const currentPage = offset / LIMIT + 1;

    const handlePageChange = (newPage: number) => {
        setOffset((newPage - 1) * LIMIT);
    };

    return (
        <>
            <div className="flex items-end gap-4 justify-between lg:flex-row-reverse">
                <div className="flex items-center gap-3 lg:grow">
                    <MdSearch className="text-slate-400 text-2xl" />
                    <Input
                        type="text"
                        placeholder={dict.commons.beneficiaries.list.searchPlaceholder}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-[300px] lg:w-full"
                    />
                </div>
                <Toolbar />
            </div>
            <div className="h-[calc(100vh-172px)] lg:h-[calc(100vh-122px)] w-full rounded-lg border-[1px] border-slate-200 flex flex-col justify-between overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        {dict.commons.beneficiaries.list.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        {dict.commons.beneficiaries.list.error}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.count <= 0 && (
                    <span className="text-sm text-slate-900 font-medium p-4">
                        {dict.commons.beneficiaries.list.noBeneficiariesFound}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.count > 0 && (
                    <>
                        <ul className="w-full h-full flex flex-col gap-[1px] overflow-y-scroll overflow-x-hidden">
                            {beneficiaries?.data.map(beneficiary => (
                                <Card
                                    key={beneficiary.id}
                                    {...beneficiary}
                                    refreshList={getHousingList}
                                />
                            ))}
                        </ul>
                        <div className="w-full h-max border-t-[1px] border-slate-200 p-2">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage === 1 ? 1 : currentPage - 1
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                    <PaginationItem className="rounded-md border border-relif-orange-200 px-2 py-1 text-sm text-relif-orange-200">
                                        {currentPage} / {totalPages}
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage === totalPages
                                                        ? totalPages
                                                        : currentPage + 1
                                                )
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export { BeneficiaryList };
