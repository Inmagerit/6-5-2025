import { i18n } from "@/app/i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    // eslint-disable-next-line no-return-assign
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    const { locales } = i18n;

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

    return matchLocale(languages, locales, i18n.defaultLocale);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const { search } = request.nextUrl;
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const urlParams = `?${new URLSearchParams(params)}`;

    if (
        [
            "/manifest.json",
            "/favicon.ico",
            "/images/logo-relif.svg",
            "/images/logo-relif-black.svg",
            "/images/banner-signin.png",
        ].includes(pathname)
    )
        return;

    const pathnameIsMissingLocale = i18n.locales.every(
        locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);

        // eslint-disable-next-line consistent-return
        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${urlParams}`,
                request.url
            )
        );
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
