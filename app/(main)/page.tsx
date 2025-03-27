import { Card, CardContent } from "@/components/ui/card";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-5"></div>
      <Card className="bg-slate-100 dark:bg-slate-800 p-4 pb-0">
        <CardContent>
          <h3 className="text-3xl text-center mb-4 font-bold">
            welcome to the conduite app
          </h3>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}
