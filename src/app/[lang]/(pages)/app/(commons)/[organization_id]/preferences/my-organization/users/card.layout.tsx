"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { usePlatformRole } from "@/app/hooks/usePlatformRole";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { UserSchema } from "@/types/user.types";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";
import { MdMail, MdPhone } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

import { UserEdit } from "./edit.layout";
import { UserReactivate } from "./reactive.layout";
import { UserRemove } from "./remove.layout";

type Props = UserSchema & {
    currentUserId: string;
    refreshList: () => void;
};

const UserCard = ({ currentUserId, refreshList, ...data }: Props): ReactNode => {
    const dict = useDictionary();
    const platformRole = usePlatformRole();

    const [editUserSheetOpenState, setEditUserSheetOpenState] = useState(false);
    const [removeUserDialogOpenState, setRemoveUserDialogOpenState] = useState(false);
    const [reactivateUserDialogOpenState, setReactivateUserDialogOpenState] = useState(false);

    const initials = data.first_name.charAt(0).concat(data.last_name.charAt(0)).toUpperCase();
    const phonesLength = data.phones.length;

    const STATUS_COLOR = {
        ACTIVE: "bg-relif-orange-200",
        INACTIVE: "bg-gray-300",
    };

    return (
        <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md lg:flex-col lg:relative">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarFallback className="bg-relif-orange-400 text-white font-semibold text-sm">
                        {initials || "US"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold flex gap-3 flex-wrap">
                        {data.first_name} {data.last_name}
                    </span>
                    <span className="text-xs text-slate-500">
                        {data?.role ||
                            dict.commons.preferences.myOrganization.users.card.roleFallback}
                    </span>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                            <MdMail />
                            {data.email}
                        </span>
                        <HoverCard>
                            <HoverCardTrigger>
                                <span className="text-xs text-slate-500 flex items-center gap-2">
                                    <MdPhone />
                                    {data.phones[0] && data.phones[0].split("_").join(" ")}
                                    {phonesLength >= 2 && (
                                        <Badge variant="outline">+{phonesLength - 1}</Badge>
                                    )}
                                </span>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                <h3 className="text-slate-900 font-bold text-sm mb-2">
                                    {dict.commons.preferences.myOrganization.users.card.phonesTitle}
                                </h3>
                                <ul>
                                    {data.phones.map(phone => (
                                        <li className="text-slate-500 w-full text-xs flex items-center gap-2">
                                            <MdPhone /> {phone.split("_").join(" ")}
                                        </li>
                                    ))}
                                </ul>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <span>
                            <Badge>
                                {data.platform_role ||
                                    dict.commons.preferences.myOrganization.users.card
                                        .platformRoleFallback}
                            </Badge>
                        </span>
                        <span>
                            <Badge
                                className={`${STATUS_COLOR[data.status as keyof typeof STATUS_COLOR]}`}
                            >
                                {data.status}
                            </Badge>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-end lg:mt-3 lg:flex-row lg:items-center lg:justify-between lg:flex-wrap"></div>

            {platformRole === "ORG_ADMIN" && (
                <>
                    <div className="lg:absolute lg:top-4 lg:right-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="icon" className="w-7 h-7 p-0">
                                    <SlOptions className="text-sm" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {/* <DropdownMenuItem onClick={() => setUserActivitiesSheetOpenState(true)}>
                            View activities
                        </DropdownMenuItem> */}
                                {/* <DropdownMenuSeparator /> */}
                                {currentUserId === data.id && (
                                    <DropdownMenuItem
                                        onClick={() => setEditUserSheetOpenState(true)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <FaEdit className="text-xs" />
                                            {
                                                dict.commons.preferences.myOrganization.users.card
                                                    .edit
                                            }
                                        </span>
                                    </DropdownMenuItem>
                                )}
                                {data.status !== "INACTIVE" && currentUserId !== data.id && (
                                    <DropdownMenuItem
                                        onClick={() => setRemoveUserDialogOpenState(true)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <FaTrash className="text-xs" />
                                            {
                                                dict.commons.preferences.myOrganization.users.card
                                                    .remove
                                            }
                                        </span>
                                    </DropdownMenuItem>
                                )}
                                {data.status === "INACTIVE" && (
                                    <DropdownMenuItem
                                        onClick={() => setReactivateUserDialogOpenState(true)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <GrRevert className="text-xs" />
                                            {
                                                dict.commons.preferences.myOrganization.users.card
                                                    .reactive
                                            }
                                        </span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <UserEdit
                        user={data}
                        refreshList={refreshList}
                        editUserSheetOpenState={editUserSheetOpenState}
                        setEditUserSheetOpenState={setEditUserSheetOpenState}
                    />

                    <UserRemove
                        user={data}
                        refreshList={refreshList}
                        removeUserDialogOpenState={removeUserDialogOpenState}
                        setRemoveUserDialogOpenState={setRemoveUserDialogOpenState}
                    />

                    <UserReactivate
                        user={data}
                        refreshList={refreshList}
                        reactivateUserDialogOpenState={reactivateUserDialogOpenState}
                        setReactivateUserDialogOpenState={setReactivateUserDialogOpenState}
                    />
                </>
            )}
        </li>
    );
};

export { UserCard };
