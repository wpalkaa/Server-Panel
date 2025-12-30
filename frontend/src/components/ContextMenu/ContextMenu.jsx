
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './ContextMenu.css';

const dirItems = [
    { id: 'open',      label: 'Otwórz' },
    { id: 'newFile',   label: 'Nowy Plik' },
    { id: 'newDir',    label: 'Nowy Folder' },
    { id: 'download',  label: 'Pobierz' },
    { id: 'rename',    label: 'Zmień nazwę' },
    { id: 'size',      label: 'Rozmiar: ' },
    { id: 'mDate',     label: 'Data modyfikacji: ' },
    { id: 'birthDate', label: 'Data utworzenia: ' }
];

const fileItems = [
    { id: 'open',      label: 'Otwórz' },
    { id: 'newFile',   label: 'Nowy Plik' },
    { id: 'newDir',    label: 'Nowy Folder' },
    { id: 'download',  label: 'Pobierz' },
    { id: 'rename',    label: 'Zmień nazwę' },
    { id: 'size',      label: 'Rozmiar: ' },
    { id: 'mDate',     label: 'Data modyfikacji: ' },
    { id: 'birthDate', label: 'Data utworzenia: ' }
];

export default function ContextMenu( {file, position, setPosition} ) {

    const params = useSearchParams();
    const currentPath = params.get('path') || '';
    const filePath = `${currentPath}/${file.name}`
    console.log("POBIERAM DLA ", filePath)

    const [fileSize, setFileSize] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const items = file.isDirectory ? dirItems : fileItems;

    function handleClick(e, item) {
        onClose();
    };

    const onClose = () => setPosition(undefined);

    async function fetchFileSize(path) {
        setIsLoading(true);
        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
            const API_URL = new URL(`/api/files/getSize${path}`, baseURL);

            const response = await fetch(API_URL);
            const data = await response.json();

            if( data.success ) {
                setFileSize(data.size);
            }
        } catch (error) {
            console.error("Error: couldn't fetch file size:\n", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    function humanizeFileSize() {
        const units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
        let size = fileSize;
        let unitIndex = 0;

        while( size > 1024 && unitIndex < units.length-1 ) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    useEffect( () => {
        fetchFileSize(filePath);
    }, []);

    return (
        <>
            <div 
                className="context-menu-backdrop" 
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                onContextMenu={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onClose();
                }}
            />


            <div 
                className="context-menu" 
                style={{left: position.x, top: position.y}}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}    
            >
                <ul className="menu-item-list">
                    {items.map( item => 
                        <li 
                            key={item.id}
                            className="menu-item"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPosition(undefined)
                                handleClick(e, item)
                            }}
                        >
                            {item.label}
                            {item.id === 'size' && humanizeFileSize()}    
                        </li>
                    )}
                </ul>
                
            </div>
        </>
    )
}