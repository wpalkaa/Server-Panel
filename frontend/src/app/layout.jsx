
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <aside className="navbar">
          <div className="navbar-logo">WP</div>
          <ul className='nav-list'>
            <li><Link href="/">Strona Główna</Link></li>
            <li><Link href="/files">Pliki</Link></li>
            <li><Link href="/resources">Zużycie Zasobów</Link></li>
            <li><Link href="/settings">Ustawienia</Link></li>
          </ul>

          <ul className='nav-user'>
            <li><Link href="/">User</Link></li>
            
          </ul>
        </aside>  
        {children}
      </body>
    </html>
  );
}
