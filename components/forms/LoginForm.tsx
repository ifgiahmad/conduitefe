"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCrewing } from "@/services/service_api_crewing";
import { Tabs, TabsContent } from "../ui/tabs";
import Image from "next/image";
import logo from "../../img/logo.png";
import Navbar from "../navbar";

const formSchema = z.object({
  seafarerCode: z.string().min(1, {
    message: "Seafarer Code Is Required",
  }),
});

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seafarerCode: "",
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logout")) {
      router.replace("/auth");
    }
  }, [router]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const ret = await getCrewing(data.seafarerCode);
      if (ret) {
        if (ret.vessel && ret.position) {
          if (ret.position === "NAKHODA" || ret.position === "KKM") {
            router.push(
              `/conduite?seafarerCode=${encodeURIComponent(ret.seafarerCode)}`
            );
          } else {
            Swal.fire({
              title: "Error!",
              text: "User anda tidak memiliki akses untuk mengisi conduite",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Data anda tidak ditemukan, silahkan hubungi team Crewing LMI Group",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      toast.error("Login failed");
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center bg-white p-1 rounded-md">
                <Image
                  src={logo}
                  alt="ShipConduct"
                  className="h-10 mr-2"
                  width={60}
                  height={80}
                />
                <div className="text-green-950 font-bold mb-2">
                  PT. Lintas Maritim Indonesia
                </div>
              </div>

              <CardTitle>Aplikasi Penilaian Crew</CardTitle>
              {/*  <CardDescription>Masukan kode pelaut anda</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="seafarerCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                          Kode Pelaut
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible: ring-offset-0"
                            placeholder="Masukan Kode Pelaut"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    className="w-full bg-green-800 hover:bg-green-400"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default LoginForm;
