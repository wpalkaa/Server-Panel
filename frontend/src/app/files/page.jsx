'use client';
import { useState, useEffect } from "react";

import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import FileRow from "@/components/Files/FileRow"

export default function FilesPage() {

    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [listedPath, setListedPath] = useState('/home');


    async function fetchFiles(path) {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/files/listFiles${path}/`);
            const data = await response.json();

            if( data.success ) {
                console.log("Debug: data:\n", data)
                setFiles(data.files);
            };
        } catch (error) {
            console.error("Error: Couldn't fetch files:\n", error)
        } finally {
            setIsLoading(false);
        };
    };


    useEffect( () => {
        fetchFiles(listedPath);
    }, []);

    return (
        <div className="files-container">
            {isLoading ? <LoadingSpinner/> : 
            files.map( (file, index) => 
                <FileRow key={`file-row#${index}`} file={file} />
            )}
        </div>
    )
};