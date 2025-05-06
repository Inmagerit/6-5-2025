import { Form } from "@/app/[lang]/(pages)/(external)/signup/form.layout";
import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import Image from "next/image";
import { ReactNode } from "react";

export default async function Page({
    params,
}: {
    params: {
        lang: Locale;
    };
}): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <div className="w-full max-w-[500px] py-[90px] lg:max-w-full lg:py-10 lg:h-full">
            <div className="flex flex-col pb-10">
                <Image
                    src="/images/logo-relif.svg"
                    alt="Logo Relif"
                    width={188}
                    height={62}
                    className="pb-[80px]"
                />
                <h1 className="font-bold text-3xl text-slate-900">{dict.signup.title}</h1>
                <p className="text-base text-slate-600">{dict.signup.subtitle}</p>
            </div>

            <Form />
        </div>
    );
}
