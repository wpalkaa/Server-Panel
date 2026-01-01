
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import './ContextMenu.css';
import axios from 'axios';


// ============ CONFIGS ============

const dirItems = [
    { id: 'open',      label: 'Otwórz',             handle: 'handleOpen' },
    { id: 'newFile',   label: 'Nowy Plik',          handle: 'handleNewFile' },
    { id: 'newDir',    label: 'Nowy Folder',        handle: 'handleNewDir' },
    { id: 'download',  label: 'Pobierz',            handle: 'handleDownload' },
    { id: 'rename',    label: 'Zmień nazwę',        handle: 'handleRename' },
    { id: 'size',      label: 'Rozmiar: ',          handle: 'null' },
    { id: 'mDate',     label: 'Data modyfikacji: ', handle: 'null' },
    { id: 'birthDate', label: 'Data utworzenia: ',  handle: 'null' }
];

const fileItems = [
    { id: 'open',      label: 'Otwórz',             handle: 'handleOpen' },
    { id: 'newFile',   label: 'Nowy Plik',          handle: 'handleNewFile' },
    { id: 'newDir',    label: 'Nowy Folder',        handle: 'handleNewDir' },
    { id: 'download',  label: 'Pobierz',            handle: 'handleDownload' },
    { id: 'rename',    label: 'Zmień nazwę',        handle: 'handleRename' },
    { id: 'size',      label: 'Rozmiar: ',          handle: 'null' },
    { id: 'mDate',     label: 'Data modyfikacji: ', handle: 'null' },
    { id: 'birthDate', label: 'Data utworzenia: ',  handle: 'null' }
];

// ============ CONFIGS ============


export default function ContextMenu( {file, position, setPosition, onRenameClick} ) {

    const params = useSearchParams();
    const currentPath = params.get('path') || '';

    const filePath = `${currentPath}/${file.name}`;

    const [fileSize, setFileSize] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const items = file.isDirectory ? dirItems : fileItems;

    
    async function handleClick(e, item) {
        const actions = {
            handleDownload: async () => {
                console.log("POBIERAM")
                try {
                    const API_URL = new URL(`/api/files/download`, process.env.NEXT_PUBLIC_SERVER_URL);
                    const response = await axios.post(API_URL, { path: filePath }, { responseType: 'blob' });

                    // Creating <a> link to download the file
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    const finalFileName = file.isDirectory ? `${file.name}.zip` : file.name;
                    link.setAttribute('download', finalFileName);
                    document.body.appendChild(link);
                    
                    link.click();
                    
                    // Clean
                    link.remove();
                    window.URL.revokeObjectURL(url);

                    console.log(response)
                } catch (error) {
                    console.error(`Error: couldn't download file:\n${error}`);
                }

            },
            handleRename: async () => {
                onRenameClick(); // State from page.jsx => RenameModal comp.

                // try {
                //     const API_URL = new URL(`/api/files/rename`, process.env.NEXT_PUBLIC_SERVER_URL);
                    
                //     const response = await axios.patch(API_URL, { path: filePath, newName: newName} );

                // } catch (error) {

                // }
            }
        }
        await actions[item.handle]();

        onClose();
    };


    const onClose = () => setPosition(undefined);


    function humanizeFileSize(fileSize) {
        const units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
        let size = fileSize;
        let unitIndex = 0;

        while( size > 1024 && unitIndex < units.length-1 ) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    async function fetchFileSize(path, isMounted) {
        setIsLoading(true);
        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
            const API_URL = new URL(`/api/files/getSize`, baseURL)

            const response = await axios.post(API_URL, {path} )
            const data = response.data;

            if( isMounted && data.success ) {
                setFileSize(data.size);
            }
        } catch (error) {
            if(isMounted) console.error("Error: couldn't fetch file size:\n", error.message);
        } finally {
            if(isMounted) setIsLoading(false);
        }
    };

    useEffect( () => {
        let isMounted = true;
        fetchFileSize(filePath, isMounted);

        return () => isMounted = false;
    }, [file]);

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
                            {item.id === 'size' && humanizeFileSize(fileSize)}    
                        </li>
                    )}
                </ul>
                
            </div>
        </>
    )
}