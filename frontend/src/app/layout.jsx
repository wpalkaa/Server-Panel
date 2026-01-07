
import { LanguageProvider } from "@/context/LanguageProvider";
import NavBar from "@/components/NavBar/NavBar";
import Username from "@/components/Username/Username";
import "./globals.css";

export default async function RootLayout({ children }) {

     return (
        <html lang="en">
            <body>
                <LanguageProvider>
                    <NavBar username={<Username/>}/>

                    {children}
                </LanguageProvider>

                <script src="https://kit.fontawesome.com/c0e27db627.js" crossOrigin="anonymous"></script>
            </body>
        </html>
  );
}
