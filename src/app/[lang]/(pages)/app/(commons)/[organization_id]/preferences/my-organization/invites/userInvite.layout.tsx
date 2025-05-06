"use client";

import { UserInviteDialogLayout } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/preferences/my-organization/invites/userInviteDialog.layout";
import { useDictionary } from "@/app/context/dictionaryContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { rejectRequest } from "@/repository/joinOrganizationRequests.repository";
import { JoinOrganizationRequestSchema } from "@/types/requests.types";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { MdCheck, MdClose } from "react-icons/md";

type Props = JoinOrganizationRequestSchema & {
    refreshList: () => void;
};

const UserInvite = ({ refreshList, ...data }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const { toast } = useToast();

    const locale = pathname.split("/")[1] as "en" | "pt" | "es";

    const handleReject = async () => {
        try {
            await rejectRequest(data.id, "");
            refreshList();
            toast({
                title: dict.commons.preferences.myOrganization.invites.user.card.requestRejected,
                description:
                    dict.commons.preferences.myOrganization.invites.user.card
                        .requestRejectedDescription,
                variant: "success",
            });
        } catch {
            toast({
                title: dict.commons.preferences.myOrganization.invites.user.card.requestFailed,
                description:
                    dict.commons.preferences.myOrganization.invites.user.card
                        .requestFailedDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarFallback className="bg-relif-orange-400 text-white font-semibold text-sm">
                        {`${data.user.first_name.charAt(0)}${data.user.last_name.charAt(0)}`}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        {data.user.first_name} {data.user.last_name}
                    </span>
                    <span className="text-xs text-slate-500">{data.user.email}</span>
                    <span className="text-xs text-slate-400 mt-2">
                        {dict.commons.preferences.myOrganization.invites.user.card.createdAt}{" "}
                        {formatDate(data.created_at, locale)}
                    </span>
                </div>
            </div>

            <div className="flex items-start gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <UserInviteDialogLayout refreshList={refreshList} request={data}>
                                <Button className="w-7 h-7 p-0 flex items-center justify-center">
                                    <MdCheck />
                                </Button>
                            </UserInviteDialogLayout>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {
                                    dict.commons.preferences.myOrganization.invites.user.card
                                        .acceptedInvitation
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
                                    dict.commons.preferences.myOrganization.invites.user.card
                                        .rejectInvitation
                                }
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </li>
    );
};

export { UserInvite };
