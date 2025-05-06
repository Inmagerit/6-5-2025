import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import { ReactNode } from "react";

export default async function Layout({
    children,
    params,
}: {
    children: ReactNode;
    params: { lang: Locale };
}): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <div className="w-full grid grid-cols-5 gap-4 p-4 xl:flex xl:items-center xl:justify-center">
            <section className="w-full h-full flex flex-col justify-center items-center col-span-2">
                {children}
            </section>
            <section className="w-full h-[calc(100vh-2rem)] bg-relif-orange-100/10 bg-[url('/images/banner-signin.png')] bg-cover bg-center rounded-lg sticky top-4 self-start col-span-3 xl:hidden">
                <h2 className="text-[40px] font-bold absolute bottom-[40px] right-[40px] leading-[50px] text-white bg-relif-orange-200 p-8 rounded-2xl border-[10px] border-white">
                    {dict.bannerLine1}
                    <br /> {dict.bannerLine2}{" "}
                    <span className="px-3 py-1 bg-white text-relif-orange-200 rounded-lg">
                        {dict.bannerTag}
                    </span>
                </h2>
            </section>
        </div>
    );
}
