"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { updatePassword } from "@/repository/password.repository";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const Form = (): ReactNode => {
    const params = useSearchParams();
    const router = useRouter();
    const dict = useDictionary();
    const { toast } = useToast();

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();

        try {
            const code = params.get("code");
            if (!code) {
                throw new Error();
            }

            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                password: string;
                confirmPassword: string;
            } = Object.fromEntries(formData);

            if (data.password !== data.confirmPassword) {
                toast({
                    title: dict.recoverPassword.toastErrorTitle,
                    description: dict.recoverPassword.toastErrorPasswordsDescription,
                    variant: "destructive",
                });
                return;
            }

            await updatePassword(code, data.password);

            toast({
                title: dict.recoverPassword.toastSuccessTitle,
                description: dict.recoverPassword.toastSuccessDescription,
                variant: "success",
            });

            setTimeout(() => router.push("/"), 1000);
        } catch (err) {
            toast({
                title: dict.recoverPassword.toastErrorTitle,
                description: dict.recoverPassword.toastErrorGenericDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="password">{dict.recoverPassword.password}</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            minLength={8}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label htmlFor="confirmPassword">
                            {dict.recoverPassword.confirmPassword}
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            minLength={8}
                            required
                        />
                    </div>
                </div>
                <div className="w-full flex flex-col items-center">
                    <Button type="submit" variant="default" className="mt-[43px] w-full">
                        {dict.recoverPassword.btnReset}
                    </Button>
                    <Button variant="link" className="no-underline mt-[20px]" asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <FaArrowLeftLong />
                            {dict.recoverPassword.btnBack}
                        </Link>
                    </Button>
                </div>
            </div>
        </form>
    );
};

export { Form };
