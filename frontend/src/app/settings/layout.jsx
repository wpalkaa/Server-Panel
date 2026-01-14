
import Navbar from "./components/Navbar/Navbar";
import './style.css'

export default function SettingsLayout({ children }) {
    return (
        <div className="settings-wrapper" style={{ display: 'flex', flexDirection:'column' }}>
            <Navbar/>
            
            <main className="settings-content" style={{ padding: '20px', flex: 1 }}>
                {children}
            </main>

        </div>
    )
}