"use client";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login, register } from "../actions/actions";
import { Card } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/components/ui/loader";
const formSchema = z.object({
    firstname: z.string().min(1, { message: "Vorname ist erforderlich" }),
    lastname: z.string().min(1, { message: "Nachname ist erforderlich" }),
    email: z.string().min(1, { message: "Email ist erforderlich" }).email({ message: "Ungültige Email Adresse" }),
    password: z
        .string()
        .min(6, { message: "Password muss mindestens 6 Zeichen beinhalten" })
        .max(16, { message: "Password ist zu lang" }),
});

export default function SignUp({ state, setState }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const response = await register(data);
            if (!response.user) {
                form.setError("password", { type: "server", message: "E-Mail oder Passwort falsch" });
                return;
            }

            router.push("/");
            setIsLoading(false);
        } catch (error) {
            form.setError("email", {
                type: "server",
                message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
            });
        }
    };

    return (
        <>
            {isLoading == true && <Loader></Loader>}
            {isLoading == false && (
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Card className="w-full max-w-md p-4">
                        <>
                            <img src="/logo.png" width={256} className="mx-auto"></img>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="firstname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vorname</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Vorname" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nachname</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nachname" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Passwort</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Passwort" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full">
                                        Registrieren
                                    </Button>
                                </form>
                            </Form>
                            <Button onClick={() => setState("signin")} variant="link" className="underline">
                                oder einloggen
                            </Button>
                        </>
                    </Card>
                </div>
            )}
        </>
    );
}
