import Navbar from "@/components/navbar";
import { Toaster } from "sonner";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <div className="p-5 w-full max-w-[1200px] md:max-w-[100px] lg:max-w-[900px] mx-auto bg-white shadow-lg rounded-lg">
          {children}
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default MainLayout;
