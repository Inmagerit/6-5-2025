"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { PDFDocument } from "@/components/reports/voluntaries";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getVoluntariesByOrganizationID } from "@/repository/organization.repository";
import { flattenObject } from "@/utils/flattenObject";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Papa from "papaparse";
import { ReactNode } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const Toolbar = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const organizationId = pathname.split("/")[3];

    const handleDownloadPDF = async () => {
        try {
            if (organizationId) {
                const response = await getVoluntariesByOrganizationID(organizationId, 0, 99999, "");
                const blob = await pdf(
                    <PDFDocument title="Volunteers" volunteers={response.data.data} />
                ).toBlob();
                saveAs(blob, "voluntaries.pdf");
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await getVoluntariesByOrganizationID(organizationId, 0, 99999, "");
            const voluntaryList = response.data.data;

            const flatData = voluntaryList.map((voluntary: any) => flattenObject(voluntary));

            const csv = Papa.unparse(flatData);

            const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(csvBlob, "voluntaries.csv");
        } catch {
            console.error("Error generating CSV");
        }
    };

    return (
        <div className="flex items-center gap-4">
            {platformRole === "ORG_ADMIN" && (
                <Button asChild>
                    <Link href={`${urlPath}/create`} className="flex items-center gap-2">
                        <MdAdd size={16} />
                        {dict.commons.volunteers.list.toolbar.createVoluntary}
                    </Link>
                </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="icon" className="w-[40px] h-[40px] p-0">
                        <FaDownload />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadCSV}>
                        <FaFileCsv />
                        {dict.commons.volunteers.list.toolbar.downloadCSV}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadPDF}>
                        <FaFilePdf />
                        {dict.commons.volunteers.list.toolbar.downloadPDF}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
