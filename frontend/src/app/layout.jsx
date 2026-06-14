
import { LanguageProvider } from "@/context/LanguageProvider";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import NavBar from "@/components/NavBar/NavBar";
import "./globals.css";

import { auth0 } from "@/lib/auth0";
import { getUsername } from "@/lib/getClientInfo";

export default async function RootLayout({ children }) {

    const session = await auth0.getSession();
    const user = await getUsername();

     return (
        <html lang="en">
            <body>
                <Auth0Provider user={session?.user}>
                    <LanguageProvider>
                        <NavBar username={user?.name ?? ""}/>

                        {children}

                        <div id="dialogs"></div>
                    </LanguageProvider>
                </Auth0Provider>

                <script src="https://kit.fontawesome.com/c0e27db627.js" crossOrigin="anonymous"></script>
            </body>
        </html>
  );
}
