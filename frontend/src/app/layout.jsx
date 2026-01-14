
import { LanguageProvider } from "@/context/LanguageProvider";
import NavBar from "@/components/NavBar/NavBar";
import "./globals.css";

import { getUser } from "@/lib/getUser";

export default async function RootLayout({ children }) {

    const user = await getUser();

     return (
        <html lang="en">
            <body>
                <LanguageProvider>
                    <NavBar username={user.name}/>

                    {children}
                </LanguageProvider>

                <script src="https://kit.fontawesome.com/c0e27db627.js" crossOrigin="anonymous"></script>
            </body>
        </html>
  );
}
