'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import FileRow from "@/components/Files/FileRow";
import RenameModal from "@/components/RenameModal/RenameModal";
import './files.css';
import axios from 'axios';


// ========== API LAYOUT ==========
//                 return {
//                     name: fileName,
//                     type: path.extname(fileName),
//                     isDirectory: stats.isDirectory(),
//                     size: stats.size,
//                     lastModified: stats.mtime,
//                     birthTime: stats.birthTime,  
//                 };
// ========== API LAYOUT ==========


export default function FilesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPath = searchParams.get('path') || '/';

    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fileToRename, setFileToRename] = useState(null);

    
    async function fetchFiles(path) {
        setIsLoading(true);

        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
            const API_URL = new URL( `/api/files/listFiles`, baseURL );

            const response = await axios.post(API_URL, {path} )
            const data = response.data;
            console.log(`Debug: fetched data: ${response}`);

            if( data.success ) {
                console.log("Debug: Fetched files:\n", data)
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
            console.error("Error: Couldn't fetch files:\n", error)
        } finally {
            setIsLoading(false);
        };
    };
    
    function handleClick(file) {
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

    useEffect( () => {
        fetchFiles(currentPath);
    }, [currentPath]);


    return (
        <div className="files-container">
            <div className="files-card">
                
                <h1 className="list-title">Lista plików</h1>

                <ul className="files-list">
                    {/* {isLoading ? <LoadingSpinner/> : 
                    files.map( (file, index) => 
                        <div key={`file-row#${index}`} onClick={() => handleClick(file)}>
                            <FileRow  file={file}/>
                        </div>
                    )} */}
                    {isLoading ? 
                    files.map( (file, index) => 
                        <li key={`file-row#${index}`}>
                            <div className="file-row-loading">
                                <div className="file-row-loading-text"/>
                            </div>
                        </li>
                    )
                        : 
                    files.map( (file, index) => 
                        <li key={`file-row#${index}`} className="file-line" >
                            <FileRow  
                                file={file} 
                                onNavigate={() => handleClick(file)}
                                handleRename={() => setFileToRename(file)} 
                            />
                        </li>
                    )}
                    
                </ul>

                {/* File Rename Modal */}
                {fileToRename && (
                    <RenameModal 
                        file={fileToRename}
                        filePath={currentPath+`/${fileToRename.name}`}
                        onClose={() => setFileToRename(null)}
                        fetchFiles={() => fetchFiles(currentPath)}
                    />)
                }

            </div>
        </div>
    )
};