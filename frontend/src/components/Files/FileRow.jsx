
export default function FileRow( {file} ) {


    function getFileIcon() {
        const icons = {
            'dir': "fa-regular fa-folder",
            '.jpg':  "fa-regular fa-file-image",
            '.jpeg': "fa-regular fa-file-image",
            '.png':  "fa-regular fa-file-image",
            '.gif':  "fa-regular fa-file-image",
            '.pdf':  "fa-regular fa-file-pdf",
            '.txt':  "fa-regular fa-file-lines",
            '.doc':  "fa-regular fa-file-word",
            '.docx': "fa-regular fa-file-word",
            '.xls':  "fa-regular fa-file-excel",
            '.xlsx': "fa-regular fa-file-excel",
            '.zip':  "fa-regular fa-file-zipper",
            '.rar':  "fa-regular fa-file-zipper",
            '.mp3':  "fa-regular fa-file-audio",
            '.mp4':  "fa-regular fa-file-video",
        };

        const fileType = file.type.toLowerCase(); 

        if( file.isDirectory ) return icons['dir'];
        return icons[fileType] || "fa-regular fa-file"
    }

    return (
        <div className="file-row">
            <i className={getFileIcon()} />
            <div className="file-name">{file.name}</div>

            <div className="file-show-more">...</div>
        </div>
    )
}