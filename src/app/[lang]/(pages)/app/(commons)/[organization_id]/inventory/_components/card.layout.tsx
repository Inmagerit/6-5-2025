"use client";

import { InputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/input.modal";
import { InputHistory } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/inputHistory.drawer";
import { OutputProductModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/output.modal";
import { OutputHistory } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/outputHistory.drawer";
import { RemoveModal } from "@/app/[lang]/(pages)/app/(commons)/[organization_id]/inventory/_components/remove.modal";
import { useDictionary } from "@/app/context/dictionaryContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductSchema } from "@/types/product.types";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
    FaArrowCircleLeft,
    FaArrowCircleRight,
    FaEdit,
    FaHandHoldingHeart,
    FaTrash,
} from "react-icons/fa";
import { FaArrowRightArrowLeft, FaBoxesPacking } from "react-icons/fa6";
import { IoMdMove } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

import { MoveProductModal } from "./move.modal";

type Props = ProductSchema & {
    refreshList: () => void;
};

const Card = ({ refreshList, ...product }: Props): ReactNode => {
    const pathname = usePathname();
    const dict = useDictionary();
    const locale = pathname.split("/")[1] as "en" | "pt" | "es";
    const inventoryPath = pathname.split("/").slice(0, 5).join("/");

    const [inputHistoryOpenState, setInputHistoryOpenState] = useState<boolean>(false);
    const [outputHistoryOpenState, setOutputHistoryOpenState] = useState<boolean>(false);
    const [modalRemoveOpenState, setModalRemoveOpenState] = useState<boolean>(false);
    const [modalInputOpenState, setModalInputOpenState] = useState<boolean>(false);
    const [modalOutputOpenState, setModalOutputOpenState] = useState<boolean>(false);
    const [modalMoveOpenState, setModalMoveOpenState] = useState<boolean>(false);

    const CATEGORIES = {
        foodAndBeverages: dict.commons.inventory.card.foodAndBeverages,
        personalCareAndBeauty: dict.commons.inventory.card.personalCareAndBeauty,
        householdCleaning: dict.commons.inventory.card.householdCleaning,
        babyCareProducts: dict.commons.inventory.card.babyCareProducts,
        petProducts: dict.commons.inventory.card.petProducts,
        pharmacyAndMedications: dict.commons.inventory.card.pharmacyAndMedications,
    };

    return (
        <li className="w-full h-max p-4 border-b-[1px] border-slate-200 flex justify-between cursor-pointer hover:bg-slate-50/70 lg:gap-4">
            <div className="flex flex-col">
                <span className="text-sm text-slate-900 font-bold">{product.name}</span>
                <div className="flex items-center gap-2">
                    <span>
                        <Badge className="bg-slate-200 text-slate-900">{product.brand}</Badge>
                    </span>
                    <span>
                        <Badge>{product.unit_type.toUpperCase()}</Badge>
                    </span>
                </div>
                <span className="text-xs text-slate-400 font-regular mt-3 flex items-center gap-2">
                    <MdCategory />
                    {CATEGORIES[product.category as keyof typeof CATEGORIES]}
                </span>
                <span className="text-xs text-slate-400 font-regular mt-1 flex items-center gap-1">
                    <FaBoxesPacking className="mr-1" />
                    <span>
                        <strong className="text-relif-orange-200">
                            {product.total_in_storage}
                        </strong>{" "}
                        {dict.commons.inventory.card.units}
                    </span>
                </span>
            </div>
            <div className="flex flex-col items-end justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="icon" className="w-7 h-7 p-0">
                            <SlOptions className="text-sm" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setInputHistoryOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaArrowRightArrowLeft />{" "}
                                {dict.commons.inventory.card.movementHistory}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setOutputHistoryOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaHandHoldingHeart /> {dict.commons.inventory.card.donateHistory}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`${inventoryPath}/${product.id}/edit`}>
                                <span className="w-full flex items-center gap-2">
                                    <FaEdit /> {dict.commons.inventory.card.editProduct}
                                </span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModalRemoveOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaTrash /> {dict.commons.inventory.card.deleteProduct}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setModalInputOpenState(true)}>
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleLeft /> {dict.commons.inventory.card.inputProduct}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={product.total_in_storage <= 0}
                            onClick={() => setModalOutputOpenState(true)}
                        >
                            <span className="w-full flex items-center gap-2">
                                <FaArrowCircleRight /> {dict.commons.inventory.card.outputProduct}
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={product.total_in_storage <= 0}
                            onClick={() => setModalMoveOpenState(true)}
                        >
                            <span className="w-full flex items-center gap-2">
                                <IoMdMove /> {dict.commons.inventory.card.moveProduct}
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-xs text-slate-400 font-regular mt-1 flex items-center gap-2 lg:hidden">
                    {dict.commons.inventory.card.createdAt}{" "}
                    {formatDate(product.created_at, locale || "en")}
                </span>
            </div>

            <InputHistory
                productType={product}
                openState={inputHistoryOpenState}
                setOpenState={setInputHistoryOpenState}
            />

            <OutputHistory
                productType={product}
                openState={outputHistoryOpenState}
                setOpenState={setOutputHistoryOpenState}
            />

            <RemoveModal
                product={product}
                refreshList={refreshList}
                removeDialogOpenState={modalRemoveOpenState}
                setRemoveDialogOpenState={setModalRemoveOpenState}
            />

            <InputProductModal
                product={product}
                refreshList={refreshList}
                modalOpenState={modalInputOpenState}
                setModalOpenState={setModalInputOpenState}
            />

            <OutputProductModal
                product={product}
                refreshList={refreshList}
                modalOpenState={modalOutputOpenState}
                setModalOpenState={setModalOutputOpenState}
            />

            <MoveProductModal
                product={product}
                refreshList={refreshList}
                modalOpenState={modalMoveOpenState}
                setModalOpenState={setModalMoveOpenState}
            />
        </li>
    );
};

export { Card };
