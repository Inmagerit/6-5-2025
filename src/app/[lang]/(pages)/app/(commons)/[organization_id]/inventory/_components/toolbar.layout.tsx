"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { PDFDocument } from "@/components/reports/product";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProductsByOrganizationID } from "@/repository/organization.repository";
import { flattenObject } from "@/utils/flattenObject";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Papa from "papaparse";
import { ReactNode } from "react";
import { FaDownload, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

const Toolbar = ({ organizationId }: { organizationId: string }): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const urlPath = pathname.split("/").slice(0, 5).join("/");

    const handleDownloadPDF = async () => {
        try {
            const response = await getProductsByOrganizationID(organizationId, 0, 99999, "");
            const blob = await pdf(
                <PDFDocument title="Products" products={response.data.data} />
            ).toBlob();
            saveAs(blob, "products.pdf");
        } catch {
            console.error("Error generating PDF");
        }
    };

    const handleDownloadCSV = async () => {
        try {
            if (organizationId) {
                const response = await getProductsByOrganizationID(organizationId, 0, 99999, "");
                const housings = response.data.data;

                const flatData = housings.map((housing: any) => flattenObject(housing));

                const csv = Papa.unparse(flatData);

                const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                saveAs(csvBlob, "products.csv");
            } else {
                throw new Error();
            }
        } catch {
            console.error("Error generating CSV");
        }
    };

    return (
        <div className="flex items-center gap-4">
            <Button asChild>
                <Link href={`${urlPath}/create`} className="flex items-center gap-2">
                    <MdAdd size={16} />
                    {dict.commons.inventory.toolbar.createProduct}
                </Link>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="icon" className="w-[40px] h-[40px] p-0">
                        <FaDownload />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadCSV}>
                        <FaFileCsv />
                        {dict.commons.inventory.toolbar.downloadCSV}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadPDF}>
                        <FaFilePdf />
                        {dict.commons.inventory.toolbar.downloadPDF}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
