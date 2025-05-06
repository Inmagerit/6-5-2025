"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { PDFDocument } from "@/components/reports/beneficiaries";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getBeneficiariesByHousingId } from "@/repository/housing.repository";
import { BeneficiarySchema } from "@/types/beneficiary.types";
import { flattenObject } from "@/utils/flattenObject";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Papa from "papaparse";
import { ReactNode, useEffect, useState, useCallback, ChangeEvent } from "react";
import { FaDownload, FaFileCsv, FaFilePdf, FaUsers } from "react-icons/fa";
import { MdAdd, MdError, MdSearch } from "react-icons/md";

import { BeneficiaryCard } from "./card.layout";

type Props = {
    housingId: string;
};

const BeneficiaryList = ({ housingId }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const urlPath = pathname.split("/").slice(0, 4).join("/");

    const [beneficiaries, setBeneficiaries] = useState<{
        count: number;
        data: BeneficiarySchema[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const LIMIT = 9999;
    const OFFSET = 0;

    const getBeneficiaryList = useCallback(
        async (filter: string = "") => {
            try {
                const response = await getBeneficiariesByHousingId(
                    housingId,
                    OFFSET,
                    LIMIT,
                    filter
                );
                setBeneficiaries(response.data);
            } catch {
                setError(true);
            } finally {
                setIsLoading(false);
            }
        },
        [housingId]
    );

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            getBeneficiaryList(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, getBeneficiaryList]);

    const handleDownloadPDF = async () => {
        try {
            const response = await getBeneficiariesByHousingId(housingId, 0, 99999, "");
            const blob = await pdf(
                <PDFDocument title="Housing beneficiaries" beneficiaries={response.data.data} />
            ).toBlob();
            saveAs(blob, `beneficiaries_${housingId}.pdf`);
        } catch {
            console.error("Error generating PDF");
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await getBeneficiariesByHousingId(housingId, 0, 99999, "");
            const beneficiaryList = response.data.data;

            const flatData = beneficiaryList.map((beneficiary: any) => flattenObject(beneficiary));

            const csv = Papa.unparse(flatData);

            const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(csvBlob, `beneficiaries_${housingId}.csv`);
        } catch {
            console.error("Error generating CSV");
        }
    };

    useEffect(() => {
        getBeneficiaryList();
    }, [getBeneficiaryList]);

    return (
        <div className="flex flex-col gap-2 w-full h-max grow border border-slate-200 rounded-lg p-2">
            <div className="w-full flex flex-wrap items-center gap-2 justify-between">
                <h3 className="text-relif-orange-200 font-bold flex items-center gap-2">
                    <FaUsers />
                    {dict.housingOverview.beneficiaryList.title}
                </h3>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="icon" className="w-8 h-8 p-0">
                                <FaDownload />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="flex gap-2" onClick={handleDownloadCSV}>
                                <FaFileCsv />
                                {dict.housingOverview.downloadCsv}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex gap-2" onClick={handleDownloadPDF}>
                                <FaFilePdf />
                                {dict.housingOverview.downloadPdf}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {platformRole === "ORG_ADMIN" && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                            asChild
                        >
                            <Link href={`${urlPath}/beneficiaries/create`}>
                                <MdAdd size={16} /> {dict.housingOverview.beneficiaryList.btnNew}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <MdSearch className="text-slate-400 text-2xl" />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder={dict.housingOverview.searchBeneficiaryPlaceholder || "Search"}
                    className="w-full h-8"
                />
            </div>
            <div className="w-full h-[calc(100vh-394px)] border border-slate-200 rounded-md overflow-hidden">
                {isLoading && (
                    <h2 className="p-4 text-relif-orange-400 font-medium text-sm">
                        {dict.housingOverview.beneficiaryList.loading}
                    </h2>
                )}

                {!isLoading && error && (
                    <span className="text-sm text-red-600 font-medium flex items-center gap-1 p-4">
                        <MdError />
                        {dict.housingOverview.beneficiaryList.error}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.data.length <= 0 && (
                    <span className="block text-sm text-slate-900 font-medium p-4">
                        {dict.housingOverview.beneficiaryList.notFound}
                    </span>
                )}

                {!isLoading && !error && beneficiaries && beneficiaries.data.length > 0 && (
                    <ul className="w-full h-full overflow-x-hidden overflow-y-scroll">
                        {beneficiaries?.data.map(beneficiary => (
                            <BeneficiaryCard key={beneficiary.id} {...beneficiary} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export { BeneficiaryList };
