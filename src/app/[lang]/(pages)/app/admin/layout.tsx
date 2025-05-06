"use client";

import { Header } from "@/app/[lang]/(pages)/app/admin/_layout/header";
import { Sidebar } from "@/app/[lang]/(pages)/app/admin/_layout/sidebar";
import { useDictionary } from "@/app/context/dictionaryContext";
import { getMe } from "@/repository/auth.repository";
import { removeFromLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }): ReactNode {
    const router = useRouter();
    const dict = useDictionary();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);

                const currentUser = await getMe();

                if (currentUser.data.platform_role !== "RELIF_MEMBER") {
                    removeFromLocalStorage("r_ud");
                    router.push("/");
                    return;
                }

                setIsLoading(false);
            } catch {
                removeFromLocalStorage("r_ud");
                router.push("/");
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <span className="text-base font-bold text-slate-900">{dict.root.loading}</span>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 bg-slate-50 grid grid-cols-[250px_1fr] lg:flex lg:flex-col lg:p-0">
            <Sidebar />
            <div className="rounded-lg bg-white min-h-[calc(100vh-32px)] border-[1px] border-slate-300 lg:border-none lg:h-screen">
                <Header />
                <div className="col-span-1">{children}</div>
            </div>
        </div>
    );
}
