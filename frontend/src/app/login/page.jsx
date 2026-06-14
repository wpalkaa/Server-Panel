
// import LoginForm from "@/app/login/components/LoginForm/LoginForm.jsx";
// import './LoginStyles.css';
import { redirect } from "next/navigation";

export default function LoginPage() {

    // return (
    //     <div className="login-page">
    //         <LoginForm/>
    //     </div>
    // )
    redirect("/auth/login");
}