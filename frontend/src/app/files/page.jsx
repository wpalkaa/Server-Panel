'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FileRow from "./components/FileRow/FileRow";
import RenameModal from "./components/RenameModal/RenameModal";
import ContextMenu from "./components/ContextMenu/ContextMenu";
import CreateModal from "./components/CreateModal/CreateModal";
import ToolBar from "./components/ToolBar/ToolBar";
import { MENU_ACTIONS, MENU_ITEMS, BACKGROUND_ITEMS, MODAL } from './config.js';
import './files.css';

import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

import axios from 'axios';


// ========== API LAYOUT ==========
                // return {
                //     name: fileName,
                //     type: path.extname(fileName),
                //     isDirectory: stats.isDirectory(),
                //     size: totalSize,
                //     lastModified: stats.mtime,
                //     birthTime: stats.birthtime,
                // };


// ============ HELPERS =============

function humanizeFileSize(size) {
    const units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
    let newSize = size;
    let unitIndex = 0;

    while( newSize > 1024 && unitIndex < units.length-1 ) {
        newSize /= 1024;
        unitIndex++;
    }
    return `${newSize.toFixed(2)} ${units[unitIndex]}`;
}

function formatDate(date) {
    if(!date) return '--';

    const newDate = new Date(date)

    const h = newDate.getHours().toString().padStart(2, '0');
    const m = newDate.getMinutes().toString().padStart(2, '0')
    const s = newDate.getSeconds().toString().padStart(2, '0');

    const D = newDate.getDate().toString().padStart(2, '0');
    const M = `${newDate.getMonth() + 1}`.toString().padStart(2, '0');
    const Y = newDate.getFullYear().toString();

    return `${h}:${m}:${s} | ${D}.${M}.${Y}`;
}

// ============ PAGE ============

export default function FilesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPath = searchParams.get('path') || '/';
    const [currentDirInfo, setCurrentDirInfo] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);
    
    const [contextMenuposition, setContextMenuPosition] = useState(undefined);
    const [contextFile, setContextFile] = useState(null);  // { file, items }
    const [modal, setModal] = useState(null); // { type: MODAL.type, file: actionFile, path: filePath}
    
    // ============ API =============

    async function fetchFiles(path, isMounted) {
        setIsLoading(true);

        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
            const API_URL = new URL( `/api/files/listFiles`, baseURL );

            const response = await axios.post(API_URL, {path} )
            const data = response.data;

            if( data.success && isMounted ) {
                let finalFiles = data.files;

                // FinalFiles sort - directories first, then alphabetical order
                finalFiles.sort( (a, b) => b.isDirectory - a.isDirectory || a.name.localeCompare(b.name) );

                // If not main directory, add previous directory to list
                if( path !== '/' ) {
                    const previousDir = {
                        name: '..',
                        type: undefined,
                        isDirectory: true,
                        size: undefined,
                        lastModified: undefined,
                        birthTime: undefined,         

                    }

                    finalFiles = [ previousDir, ...finalFiles ];
                }

                setFiles(finalFiles);
            };
        } catch (error) {
            if(isMounted) {
                setError(error?.response?.data?.message);
                console.error(
                    "Error: Couldn't fetch files:\n", 
                    error?.response?.data?.message || error.message || "Nieznany błąd");
            }
        } finally {
            setIsLoading(false);
        };
    };

    async function fetchFileInfo(path, isMounted) {
        setIsLoading(true);

        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
            const API_URL = new URL( `/api/files/getFileInfo`, baseURL );

            const response = await axios.post(API_URL, {path} )
            const data = response.data;

            if( data.success && isMounted ) {
                setCurrentDirInfo(data.fileInfo);
            };
        } catch (error) {
            if(isMounted) {
                setError(error?.response?.data?.message);
                console.error(
                    "Error: Couldn't fetch file info:\n", 
                    error?.response?.data?.message || error.message || "Nieznany błąd");
            }
        } finally {
            setIsLoading(false);
        };
    };

    async function renameFile(filePath, newName) {
        setIsLoading(true);

        try {
            const API_URL = new URL(`/api/files/rename`, process.env.NEXT_PUBLIC_SERVER_URL);
            
            console.log(filePath)
            const response = await axios.patch(API_URL, { path: filePath, newName: newName} );

            // If okay, refresh file list
            if( response.data.success ) {
                fetchFiles(currentPath, true);
                setModal(null);
            };

        } catch (error) {
            console.error(
                `Error: couldn't rename file:\n`,
                error?.response?.data?.message || error.message || "Nieznany błąd");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };


    async function downloadFile(file, filePath) {
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

        } catch (error) {
            console.error(
                `Error: couldn't download file:\n`,
                error?.response?.data?.message || error.message || "Nieznany błąd");
            }
        };

    async function deleteFile(filePath) {
        setIsLoading(true);

        try {
            const API_URL = new URL(`/api/files/delete`, process.env.NEXT_PUBLIC_SERVER_URL);
            
            console.log(filePath)
            const response = await axios.delete(API_URL, { data: { path: filePath } } );

            // If okay, refresh file list
            if( response.data.success ) {
                fetchFiles(currentPath, true);
                setModal(null);
            };

        } catch (error) {
            console.error(
                `Error: couldn't delete file:\n`,
                error?.response?.data?.message || error.message || "Nieznany błąd");
        } finally {
            setIsLoading(false);
        }
    };

    async function createFile(filePath, fileName, isDirectory) {
        setIsLoading(true);

        try {
            const API_URL = new URL(`/api/files/create`, process.env.NEXT_PUBLIC_SERVER_URL);
            
            console.log(filePath)
            const response = await axios.post(API_URL, { path: filePath, name: fileName, isDirectory } );

            // If okay, refresh file list
            if( response.data.success ) {
                fetchFiles(currentPath, true);
                setModal(null);
            };

        } catch (error) {
            console.error(
                `Error: couldn't create file:\n`,
                error?.response?.data?.message || error.message || "Nieznany błąd");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // ============ HANDLERS ============

    function handleNavigate(file) {
        if (!file.isDirectory) return;

        const pathParts = currentPath.split('/').filter(Boolean); // remove empty strings

        if (file.name === '..') {
            pathParts.pop();
        } else {
            pathParts.push(file.name);
        }

        const newPath = pathParts.join('/');

        router.push( newPath ? `/files?path=/${newPath}` : '/files' );
    };

    function handleContextMenu(e, file, items) {
        e.preventDefault();
        e.stopPropagation();

        if( file?.name === '..' ) return;
        setContextFile({file, items});

        setContextMenuPosition( {
            x: e.clientX + 8,
            y: e.clientY - 100
        } );
    }

    function handleContextAction(action, overrideContextFile = null) {
        const activeContext = overrideContextFile || contextFile
        const actionFile = activeContext.file;
        
        const isTargettingBackground = activeContext.items === BACKGROUND_ITEMS;
        console.log("[Debug]: is Targetting Background",isTargettingBackground)

        const filePath = isTargettingBackground 
            ? currentPath
            : (currentPath !== '/' 
                ? `${currentPath}/${actionFile.name}` 
                : `/${actionFile.name}`);
        console.log("[Debug]: fpath",filePath);

        const parentDir = actionFile.isDirectory ? filePath : currentPath;

        switch(action) {
            case MENU_ACTIONS.NEW_FILE:
                setModal( { type: MODAL.CREATE, file: actionFile, path: parentDir, isDirectory: false } );
                break;
            case MENU_ACTIONS.NEW_DIR:
                setModal( { type: MODAL.CREATE, file: actionFile, path: parentDir, isDirectory: true } );
                break;
            case MENU_ACTIONS.RENAME:
                setModal( { type: MODAL.RENAME, file: actionFile, path: filePath } );
                break;
            case MENU_ACTIONS.DOWNLOAD:
                downloadFile(actionFile, filePath);
                break;
            case MENU_ACTIONS.DELETE:           
                setModal( { type: MODAL.DELETE, file: actionFile, path: filePath } );
                break;
            case MENU_ACTIONS.REFRESH:
                fetchFiles(currentPath, true);
                break;
            case MENU_ACTIONS.INFO:
                break;
        }
        
        setContextMenuPosition(null);
        setContextFile(null);
    }

    // ============ useEffect ============

    useEffect( () => {
        let isMounted = true;

        fetchFiles(currentPath, isMounted);
        fetchFileInfo(currentPath, isMounted);

        return () => isMounted = false;
    }, [currentPath]);


    return (
        <div className="files-container">
            <div className="files-card">
                
                <h1 className="list-title">Lista plików</h1>

                <ToolBar 
                    currentDirInfo={currentDirInfo}
                    currentPath={currentPath}
                    humanizeFileSize={humanizeFileSize} 
                    formatDate={formatDate}
                    handleClick={(action) => {
                    handleContextAction(action, { file: currentDirInfo, items: BACKGROUND_ITEMS });
                    }}
                />

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                {!error && (<div 
                    className="files-list" 
                    style={{alignItems: error ? "center" : ""}}
                    onContextMenu={(e) => handleContextMenu(e, currentDirInfo, BACKGROUND_ITEMS)}    
                >

                    {files.map( (file) => 
                        <div key={file.name} className="file-item">
                            <FileRow  
                                file={file} 
                                handleShowMore={(e) => handleContextMenu(e, file, MENU_ITEMS)}
                                onNavigate={() => handleNavigate(file)}
                            />
                        </div>
                    )}
                </div>)}

                {/* Show More Modal */}
                {contextMenuposition && ( 
                    <ContextMenu
                        items={contextFile.items}
                        position={contextMenuposition}
                        onAction={handleContextAction}
                        onClose={() => {
                            setContextMenuPosition(null);
                            setContextFile(null);
                        }}
                        extra={{
                            size: humanizeFileSize(contextFile.file.size),
                            mtime: formatDate(contextFile.file.lastModified),
                            birthTime: formatDate(contextFile.file.birthTime),
                        }
                        }
                    />
                )}

                {/* File Rename Modal */}
                {modal?.type === MODAL.RENAME && (
                    <RenameModal
                        file={modal.file}
                        onSubmit={(newName) => renameFile(modal.path, newName)}
                        onClose={() => setModal(null)}
                    />
                )}

                {/* File Delete Modal */}
                {modal?.type === MODAL.DELETE && (
                    <ConfirmationModal
                        message={
                            <>
                                <p>Czy napewno chcesz usunąć plik <b>{modal.file.name}</b>?
                                <br></br>Tej operacji nie da się cofnąć:</p>
                            </>
                        }
                        onSubmit={() => deleteFile(modal.path)}
                        onCancel={() => setModal(null)}
                    />
                )}

                {/* File Create Modal */}
                {modal?.type === MODAL.CREATE && (
                    <CreateModal
                        onSubmit={(fileName) => createFile(modal.path, fileName, modal.isDirectory)}
                        onCancel={() => setModal(null)}
                        isDirectory={modal.isDirectory}
                    />
                )}


            </div>
        </div>
    )
};