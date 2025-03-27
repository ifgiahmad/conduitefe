import Image from "next/image";
import Link from "next/link";
import logo from "../img/logo.png";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <header className="bg-teal-600 p-2">
      {" "}
      {/* Mengurangi padding navbar */}
      <div className="bg-emerald-900 dark:bg-green-900 text-white py-1 px-3 flex justify-between items-center">
        <div className="flex flex-col items-center bg-white p-1 rounded-md">
          <Image
            src={logo}
            alt="ShipConduct"
            className="h-8 w-auto" // Ukuran logo lebih kecil
            width={50} // Kurangi ukuran lebar logo
            height={60} // Kurangi ukuran tinggi logo
          />
          <div className="text-green-950 font-bold text-sm">
            PT. Lintas Maritim Indonesia
          </div>{" "}
          {/* Ukuran teks lebih kecil */}
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar className="w-8 h-8">
                {" "}
                {/* Avatar lebih kecil */}
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback className="text-black text-xs">
                  Logout
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-sm">
              {" "}
              {/* Dropdown lebih kecil */}
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
