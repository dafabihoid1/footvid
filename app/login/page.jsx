"use client";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "../actions/actions";
import { Card } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
const formSchema = z.object({
    email: z.string().min(1, { message: "Email ist erforderlich" }).email({ message: "Ungültige Email Adresse" }),
    password: z
        .string()
        .min(6, { message: "Password muss mindestens 6 Zeichen beinhalten" })
        .max(16, { message: "Password ist zu lang" }),
});

export default function LoginPage() {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await login(data);
            if (!response.user) {
                form.setError("password", { type: "server", message: "E-Mail oder Passwort falsch" });
                return;
            }
            router.push("/");
        } catch (error) {
            form.setError("email", {
                type: "server",
                message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
            });
        }
    };

    return (
        <div className="container mx-auto">
            <Card className="w-[40vh] mx-auto mt-40 p-4">
                <>
                    <img src="/logo.png" width={256} className="mx-auto"></img>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                Anmelden
                            </Button>
                        </form>
                    </Form>
                </>
            </Card>
        </div>
    );
}
