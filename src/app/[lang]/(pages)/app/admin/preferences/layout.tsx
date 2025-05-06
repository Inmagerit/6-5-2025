import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import { ReactNode } from "react";
import { MdSettings } from "react-icons/md";

import { Menu } from "./menu.layout";

export default async function Layout({
    children,
    params,
}: {
    children: ReactNode;
    params: { lang: Locale };
}): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <>
            <div className="border-b-[1px] border-slate-200 p-8">
                <h1 className="text-slate-900 font-bold text-2xl flex items-center gap-4">
                    <span className="w-[40px] h-[40px] bg-relif-orange-200 flex items-center justify-center text-white rounded-lg">
                        <MdSettings />
                    </span>
                    {dict.admin.preferences.title}
                </h1>
            </div>
            <div className="grid grid-cols-[350px_auto] lg:flex lg:flex-col">
                <div className="w-full h-[calc(100vh-188px)] p-2 lg:h-max">
                    <Menu />
                </div>
                <div className="w-full h-full p-2">{children}</div>
            </div>
        </>
    );
}
