
import Navbar from "./components/Navbar/Navbar";
import './style.css'

export default function SettingsLayout({ children }) {
    return (
        <div className="settings-wrapper">
            <Navbar/>
            
            <main className="settings-content">
                {children}
            </main>

        </div>
    )
}