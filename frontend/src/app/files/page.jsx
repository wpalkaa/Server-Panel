'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import FileRow from "@/components/Files/FileRow"
import './files.css'


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

    const currentPath = searchParams.get('path') || '/'

    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


    
    async function fetchFiles(path) {
        setIsLoading(true);

        try {
            const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
            const API_URL = new URL( `/api/files/listFiles${path}`, baseURL );
            
            const response = await fetch(API_URL.toString());
            const data = await response.json();

            if( data.success ) {
                console.log("Debug: data:\n", data)
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
                        <li key={`file-row#${index}`} >
                            <FileRow  file={file} onNavigate={() => handleClick(file)} />
                        </li>
                    )}
                    
                </ul>
            </div>
        </div>
    )
};