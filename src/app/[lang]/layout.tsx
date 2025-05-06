import { DictionaryProvider } from "@/app/context/dictionaryContext";
import { getDictionary } from "@/app/dictionaries";
import { Locale } from "@/app/i18n-config";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ReactNode } from "react";
import "../globals.css";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: {
        template: "%s | Relif",
        default: "Relif",
    },
};

export async function generateStaticParams(): Promise<{ lang: string }[]> {
    return [{ lang: "en-US" }, { lang: "es" }, { lang: "pt-BR" }];
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: ReactNode;
    params: { lang: Locale };
}>): Promise<ReactNode> {
    const dict = await getDictionary(params.lang);

    return (
        <html lang={params.lang}>
            <body className={cn("min-h-screen bg-white font-sans antialiased", fontSans.variable)}>
                <DictionaryProvider dict={dict}>
                    <main>{children}</main>
                    <Toaster />
                </DictionaryProvider>
            </body>
        </html>
    );
}
