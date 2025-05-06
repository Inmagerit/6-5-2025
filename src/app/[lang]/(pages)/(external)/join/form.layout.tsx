"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { orgSignUp } from "@/repository/auth.repository";
import { consumeInvite } from "@/repository/joinPlatformInvites.repository";
import { getTimezone } from "@/utils/getTimezone";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";

const Form = (): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [checkState, setCheckState] = useState<boolean>(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                firstName: string;
                lastName: string;
                role: string;
                countryCode: string;
                phone: string;
                email: string;
                password: string;
                confirmPassword: string;
            } = Object.fromEntries(formData);

            if (data.password !== data.confirmPassword) {
                toast({
                    title: dict.signup.toastErrorTitle,
                    description: dict.signup.toastErrorPasswordsDescription,
                    variant: "destructive",
                });
                return;
            }

            const timezone = getTimezone();

            if (!code) {
                toast({
                    title: dict.signup.toastErrorTitle,
                    description: dict.signup.toastErrorGenericDescription,
                    variant: "destructive",
                });
                return;
            }

            const { data: invite } = await consumeInvite(code);

            await orgSignUp({
                first_name: data.firstName,
                last_name: data.lastName,
                email: invite.invited_email,
                password: data.password,
                phones: [`${data.countryCode}_${data.phone}`],
                role: data.role,
                organization_id: invite.organization_id,
                preferences: {
                    language: "english",
                    timezone,
                },
            });

            toast({
                title: dict.signup.toastSuccessTitle,
                description: dict.signup.toastSuccessDescription,
                variant: "success",
            });

            router.push("/");
        } catch (err) {
            toast({
                title: dict.signup.toastErrorTitle,
                description: dict.signup.toastErrorGenericDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-medium text-sm text-relif-orange-200 mb-6">
                {dict.signup.yourPersonalData}
            </h2>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Label htmlFor="firstName">{dict.signup.firstName} *</Label>
                    <Input id="firstName" name="firstName" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="lastName">{dict.signup.lastName} *</Label>
                    <Input id="lastName" name="lastName" type="text" required />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="role">{dict.signup.role} *</Label>
                    <Input
                        id="role"
                        name="role"
                        type="text"
                        placeholder="e.g. Director of Human Resources"
                        required
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="phone">{dict.signup.phone} *</Label>
                    <div className="w-full flex gap-2">
                        <Input
                            id="countryCode"
                            name="countryCode"
                            type="text"
                            placeholder="e.g. +55"
                            className="w-[30%]"
                            required
                        />
                        <Input id="phone" name="phone" type="text" required />
                    </div>
                </div>
            </div>

            <h2 className="border-b-[1px] border-dashed border-slate-200 pb-2 font-medium text-sm text-relif-orange-200 mt-10 mb-6">
                {dict.signup.yourCredentials}
            </h2>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <Label htmlFor="password">{dict.signup.password} *</Label>
                    <Input id="password" name="password" type="password" required minLength={8} />
                </div>

                <div className="flex flex-col gap-3">
                    <Label htmlFor="confirmPassword">{dict.signup.confirmPassword} *</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={8}
                    />
                </div>

                <div className="items-top flex space-x-2">
                    <Checkbox
                        id="terms"
                        onCheckedChange={(checked: boolean) => setCheckState(checked)}
                        checked={checkState}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                            htmlFor="terms"
                            className="text-sm text-slate-900 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {dict.signup.checkboxLabel}
                        </label>
                        <p className="text-sm text-slate-600">
                            {dict.signup.checkboxDescription}{" "}
                            <Link
                                href="/terms/terms-of-service"
                                className="underline hover:text-relif-orange-200 underline-offset-4"
                            >
                                {dict.signup.terms}
                            </Link>{" "}
                            {dict.signup.and}{" "}
                            <Link
                                href="/terms/privacy-policy"
                                className="underline hover:text-relif-orange-200 underline-offset-4"
                            >
                                {dict.signup.privacyPolicy}
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center">
                <Button
                    type="submit"
                    variant="default"
                    className="mt-[43px] w-full"
                    disabled={!checkState}
                >
                    {dict.signup.btnSignUp}
                </Button>
            </div>
        </form>
    );
};

export { Form };
