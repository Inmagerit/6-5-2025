"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { PDFDocument } from "@/components/reports/organizations";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findAllOrganizations } from "@/repository/organization.repository";
import { flattenObject } from "@/utils/flattenObject";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { ReactNode } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";

const Toolbar = (): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const handleDownloadPDF = async () => {
        try {
            const response = await findAllOrganizations(0, 99999);
            const blob = await pdf(
                <PDFDocument title="Organizations" organizations={response.data.data} />
            ).toBlob();
            saveAs(blob, "organizations.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const response = await findAllOrganizations(0, 99999);
            const organizationList = response.data.data;

            const flatData = organizationList.map((org: any) => flattenObject(org));

            const csv = Papa.unparse(flatData);

            const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(csvBlob, "organizations.csv");
        } catch {
            console.error("Error generating CSV");
        }
    };

    if (platformRole !== "RELIF_MEMBER") return <div />;

    return (
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button
                        variant="icon"
                        className="w-max h-[40px] p-0 flex items-center gap-3 px-5"
                    >
                        {dict.admin.organizations.list.toolbar.reports}
                        <FaDownload />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadCSV}>
                        <FaFileCsv />
                        {dict.admin.organizations.list.toolbar.downloadCSV}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadPDF}>
                        <FaFilePdf />
                        {dict.admin.organizations.list.toolbar.downloadPDF}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
