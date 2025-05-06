"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Breadcrumb as UIBreadcrumb,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const Breadcrumb = (): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const splittedPathname = pathname.split("/");

    const pages = splittedPathname.slice(2);
    const currentPage = pages.pop();

    const getHref = (page: string): string => {
        if (page === "app") return `${splittedPathname.slice(0, 4).join("/")}`;

        const index = splittedPathname.indexOf(page);
        if (index === -1) {
            return `${splittedPathname.join("/")}`;
        }

        return `${splittedPathname.slice(0, index + 1).join("/")}`;
    };

    const LABELS = {
        app: dict.commons.header.breadcrumb.app,
        housing: dict.commons.header.breadcrumb.housing,
        beneficiaries: dict.commons.header.breadcrumb.beneficiaries,
        volunteers: dict.commons.header.breadcrumb.volunteers,
        inventory: dict.commons.header.breadcrumb.inventory,
        preferences: dict.commons.header.breadcrumb.preferences,
        platform: dict.commons.header.breadcrumb.platform,
        "my-organization": dict.commons.header.breadcrumb.myOrganization,
        "my-profile": dict.commons.header.breadcrumb.myProfile,
        support: dict.commons.header.breadcrumb.support,
        users: dict.commons.header.breadcrumb.users,
        overview: dict.commons.header.breadcrumb.overview,
        invites: dict.commons.header.breadcrumb.invites,
        others: dict.commons.header.breadcrumb.others,
        housings: dict.commons.header.breadcrumb.housings,
        assistance: dict.commons.header.breadcrumb.assistance,
        movements: dict.commons.header.breadcrumb.movements,
        create: dict.commons.header.breadcrumb.create,
        edit: dict.commons.header.breadcrumb.edit,
        entry: dict.commons.header.breadcrumb.entry,
        admin: dict.commons.header.breadcrumb.admin,
        organizations: dict.commons.header.breadcrumb.organizations,
        requests: dict.commons.header.breadcrumb.requests,
    };

    return (
        <UIBreadcrumb className="lg:hidden">
            <BreadcrumbList>
                {pages?.map(page => (
                    <div key={page} className="flex items-center gap-3">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={getHref(page)}>
                                    {LABELS[page as keyof typeof LABELS] ??
                                        page?.toString().slice(0, 5).concat("...")}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </div>
                ))}

                <BreadcrumbItem>
                    <BreadcrumbPage>
                        {LABELS[currentPage as keyof typeof LABELS] ??
                            currentPage?.toString().slice(0, 5).concat("...")}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </UIBreadcrumb>
    );
};

export { Breadcrumb };
