"use client";

import { useDictionary } from "@/app/context/dictionaryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { requestChange } from "@/repository/password.repository";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const Form = (): ReactNode => {
    const { toast } = useToast();
    const dict = useDictionary();

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: any): Promise<void> => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData: FormData = new FormData(e.target);

            // @ts-ignore
            const data: {
                email: string;
            } = Object.fromEntries(formData);

            await requestChange(data.email);

            setIsLoading(false);
            toast({
                title: dict.forgotPassword.toastSuccessTitle,
                description: dict.forgotPassword.toastSuccessDescription,
                variant: "success",
            });
        } catch (err) {
            setIsLoading(false);
            toast({
                title: dict.forgotPassword.toastErrorTitle,
                description: dict.forgotPassword.toastErrorDescription,
                variant: "destructive",
            });
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="email">{dict.forgotPassword.email}</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder={dict.forgotPassword.fieldPlaceholder}
                    />
                </div>
                <div className="w-full flex flex-col items-center">
                    <Button
                        type="submit"
                        variant="default"
                        className="mt-[43px] w-full"
                        disabled={isLoading}
                    >
                        {!isLoading
                            ? dict.forgotPassword.btnSendEmail
                            : dict.forgotPassword.loading}
                    </Button>
                    <Button variant="link" className="no-underline mt-[20px]" asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <FaArrowLeftLong />
                            {dict.forgotPassword.btnBack}
                        </Link>
                    </Button>
                </div>
            </div>
        </form>
    );
};

export { Form };
