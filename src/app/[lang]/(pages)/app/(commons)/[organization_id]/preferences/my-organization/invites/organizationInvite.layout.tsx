import { OrganizationInviteDialog } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/invites/organizationInviteDialog.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { rejectRequest } from "@/repository/organizationDataAccessRequests.repository";
import { OrganizationDataAccessRequestSchema } from "@/types/organization.types";
import { convertToTitleCase } from "@/utils/convertToTitleCase";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { MdCheck, MdClose, MdInfo, MdPhone } from "react-icons/md";

type InfoCardProps = OrganizationDataAccessRequestSchema & {
    children: Readonly<ReactNode>;
};

const OrganizationInfoCard = ({ children, ...data }: InfoCardProps): ReactNode => {
    const dict = useDictionary();

    return (
        <HoverCard>
            <HoverCardTrigger>{children}</HoverCardTrigger>
            <HoverCardContent>
                <h3 className="text-sm text-slate-900 font-bold">
                    {data?.requester_organization?.name}
                </h3>
                <span className="flex w-full pt-3 border-b-[1px] border-slate-200" />
                <h4 className="text-relif-orange-200 text-xs font-bold pt-3 pb-1 flex items-center gap-1">
                    <MdPhone />
                    {
                        dict.commons.preferences.myOrganization.invites.organization.card
                            .requesterContact
                    }
                </h4>
                <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-slate-500">{data?.requester?.email}</span>
                </div>
                <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                        {data.requester?.phones[0]
                            .split("_")[0]
                            .concat(data?.requester?.phones[0].split("_")[1])}
                    </span>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

type Props = OrganizationDataAccessRequestSchema & {
    refreshList: () => void;
};

const OrganizationInvite = ({ refreshList, ...data }: Props): ReactNode => {
    const { toast } = useToast();
    const pathname = usePathname();
    const dict = useDictionary();

    const locale = pathname.split("/")[1] as "en" | "es" | "pt";

    const handleReject = async () => {
        try {
            await rejectRequest(data.id, "");
            refreshList();
            toast({
                title: dict.commons.preferences.myOrganization.invites.organization.card.toast
                    .requestRejected,
                description:
                    dict.commons.preferences.myOrganization.invites.organization.card.toast
                        .requestRejectedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.invites.organization.card.toast
                    .requestFailed,
                description:
                    dict.commons.preferences.myOrganization.invites.organization.card.toast
                        .requestFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md">
            <div className="flex gap-4">
                <OrganizationInfoCard {...data}>
                    <div className="w-8 h-8 rounded-md bg-relif-orange-500 text-white text-xl flex items-center justify-center">
                        <MdInfo />
                    </div>
                </OrganizationInfoCard>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        {convertToTitleCase(data.requester_organization.name)}
                    </span>
                    <span className="text-xs text-slate-500">
                        <strong>
                            {dict.commons.preferences.myOrganization.invites.organization.card.by}:{" "}
                        </strong>
                        {data.requester.first_name} {data.requester.last_name}
                    </span>
                    <span className="text-xs text-slate-500">
                        <strong>
                            {
                                dict.commons.preferences.myOrganization.invites.organization.card
                                    .email
                            }
                            :{" "}
                        </strong>
                        {data.requester.email}
                    </span>

                    {data.status === "PENDING" && (
                        <span className="text-xs text-slate-400 mt-2">
                            {formatDate(data.created_at, locale || "en")}
                        </span>
                    )}

                    <div className="mt-1">
                        {data.status === "REJECTED" && (
                            <span>
                                <Badge className="bg-red-600">
                                    REJECTED | {formatDate(data.rejected_at, locale || "en")}
                                </Badge>
                            </span>
                        )}
                        {data.status === "ACCEPTED" && (
                            <span>
                                <Badge className="bg-green-600">
                                    ACCEPTED | {formatDate(data.accepted_at, locale || "en")}
                                </Badge>
                            </span>
                        )}
                        {data.status === "PENDING" && (
                            <span>
                                <Badge className="bg-green-600">PENDING APPROVAL</Badge>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {data.status === "PENDING" && (
                <div className="flex items-start gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <OrganizationInviteDialog refreshList={refreshList} request={data}>
                                    <Button className="w-7 h-7 p-0 flex items-center justify-center">
                                        <MdCheck />
                                    </Button>
                                </OrganizationInviteDialog>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {
                                        dict.commons.preferences.myOrganization.invites.organization
                                            .card.acceptedInvitation
                                    }
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Button
                                    variant="outline"
                                    className="w-7 h-7 p-0 flex items-center justify-center"
                                    onClick={handleReject}
                                >
                                    <MdClose />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    {
                                        dict.commons.preferences.myOrganization.invites.organization
                                            .card.rejectInvitation
                                    }
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
        </li>
    );
};

export { OrganizationInvite };
