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
import { getBeneficiariesByOrganizationID } from "@/repository/organization.repository";
import { flattenObject } from "@/utils/flattenObject";
import { getFromLocalStorage } from "@/utils/localStorage";
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
    const platformRole = usePlatformRole();
    const dict = useDictionary();

    const urlPath = pathname.split("/").slice(0, 5).join("/");
    const organizationId = pathname.split("/")[3];
    const currentUser = getFromLocalStorage("r_ud");

    const handleDownloadPDF = async () => {
        try {
            if (organizationId) {
                const response = await getBeneficiariesByOrganizationID(
                    organizationId,
                    0,
                    99999,
                    ""
                );
                const blob = await pdf(
                    <PDFDocument title="Housing Spaces" beneficiaries={response.data.data} />
                ).toBlob();
                saveAs(blob, "beneficiaries.pdf");
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(dict.commons.beneficiaries.toolbar.errorGeneratingPDF, error);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            if (organizationId) {
                const response = await getBeneficiariesByOrganizationID(
                    organizationId,
                    0,
                    99999,
                    ""
                );
                const beneficiaries = response.data.data;

                const flatData = beneficiaries.map((beneficiary: any) =>
                    flattenObject(beneficiary)
                );

                const csv = Papa.unparse(flatData);

                const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                saveAs(csvBlob, "beneficiaries.csv");
            } else {
                throw new Error();
            }
        } catch (error) {
            console.error(dict.commons.beneficiaries.toolbar.errorGeneratingCSV, error);
        }
    };

    const isMyOrganization = currentUser.organization_id === organizationId;

    return (
        <div className="flex flex-wrap items-center gap-4">
            {platformRole === "ORG_ADMIN" && isMyOrganization && (
                <Button asChild>
                    <Link href={`${urlPath}/create`} className="flex items-center gap-2">
                        <MdAdd size={16} />
                        {dict.commons.beneficiaries.toolbar.createBeneficiary}
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
                        {dict.commons.beneficiaries.toolbar.downloadCSV}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex gap-2" onClick={handleDownloadPDF}>
                        <FaFilePdf />
                        {dict.commons.beneficiaries.toolbar.downloadPDF}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export { Toolbar };
