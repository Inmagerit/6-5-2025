"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserSchema } from "@/types/user.types";
import { ReactNode, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdMail, MdPhone } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

import { UserRemove } from "./remove.layout";

type Props = UserSchema & {
    currentUserId: string;
    refreshList: () => void;
};

const UserCard = ({ currentUserId, refreshList, ...data }: Props): ReactNode => {
    const dict = useDictionary();
    const [removeUserDialogOpenState, setRemoveUserDialogOpenState] = useState(false);
    const initials = data.first_name.charAt(0).concat(data.last_name.charAt(0));

    return (
        <li className="w-full h-max flex justify-between p-4 border-[1px] border-slate-200 rounded-md lg:flex-col lg:relative">
            <div className="flex gap-4">
                <Avatar>
                    <AvatarFallback className="bg-relif-orange-400 text-white font-semibold text-sm">
                        {initials || "US"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">
                        {data.first_name} {data.last_name}
                    </span>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                            <MdMail />
                            {data.email}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-2">
                            <MdPhone />
                            {data.phones[0]}
                        </span>
                        <span className="text-xs text-slate-500">
                            {data?.role || dict.admin.preferences.users.card.colaborator}
                        </span>
                    </div>
                </div>
            </div>

            <div className="lg:absolute lg:top-4 lg:right-4">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => setRemoveUserDialogOpenState(true)}
                            disabled={currentUserId === data.id}
                        >
                            <span className="flex items-center gap-2">
                                <FaTrash className="text-xs" />
                                {dict.admin.preferences.users.card.remove}
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <UserRemove
                user={data}
                refreshList={refreshList}
                removeUserDialogOpenState={removeUserDialogOpenState}
                setRemoveUserDialogOpenState={setRemoveUserDialogOpenState}
            />
        </li>
    );
};

export { UserCard };
