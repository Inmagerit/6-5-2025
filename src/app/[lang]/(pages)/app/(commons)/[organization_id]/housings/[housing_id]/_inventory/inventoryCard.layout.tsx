import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";
import { SlOptions } from "react-icons/sl";

const InventoryCard = (): ReactNode => {
    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">
                    Pacote de fraldas Pampers c/ 24 unidades
                </span>
                <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    Pampers | <strong className="text-relif-orange-200">14 unidades</strong>
                </span>
            </div>
            <div className="flex items-start">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleRight /> Dar entrada no produto
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleLeft /> Dar baixa no produto
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <span className="w-full flex items-center gap-2">
                                <IoMdMove /> Mover para outro estoque
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </li>
    );
};

export { InventoryCard };
