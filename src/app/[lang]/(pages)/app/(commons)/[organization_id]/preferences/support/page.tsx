import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import { ReactNode } from "react";

export default async function Page({ params }: { params: { lang: Locale } }): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <div className="w-full h-[calc(100vh-204px)] p-4 border-[1px] border-slate-200 rounded-md overflow-x-hidden overflow-y-scroll">
            <h2 className="font-bold text-base text-relif-orange-200">
                {dict.commons.preferences.support.message}
            </h2>
        </div>
    );
}
