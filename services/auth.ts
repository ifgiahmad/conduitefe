import { CrewRole } from "@/lib/type";
import axios from "axios";
import { CrewLogin } from "@/lib/type";

// Definisikan tipe untuk login response dan login form
interface LoginResponse {
  succeeded: boolean;
  message?: string;
  roleCode?: string;
  superUser?: boolean;
}

interface LoginForm {
  username: string;
  password: string;
}
