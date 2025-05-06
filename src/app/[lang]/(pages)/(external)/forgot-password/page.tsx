import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import Image from "next/image";
import { ReactNode } from "react";

import { Form } from "./form.layout";

export default async function Page({
    params,
}: {
    params: {
        lang: Locale;
    };
}): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <div className="w-full max-w-[500px] py-[90px] sm:p-5 xl:p-4 xl:h-[calc(100vh-2rem)] xl:flex xl:flex-col xl:justify-center">
            <div className="flex flex-col mb-10">
                <Image
                    src="/images/logo-relif.svg"
                    alt="Logo Relif"
                    width={188}
                    height={62}
                    className="mb-[40px]"
                />
                <h1 className="font-bold text-2xl text-slate-900">{dict.forgotPassword.title}</h1>
                <p className="text-base text-slate-600">{dict.forgotPassword.subtitle}</p>
            </div>

            <Form />
        </div>
    );
}
