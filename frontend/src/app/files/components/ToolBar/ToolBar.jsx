
import { useTranslation } from '@/context/LanguageProvider';
import SortTooltip from '../SortTooltip/SortTooltip';
import { MENU_ACTIONS } from '../../config';
import './ToolBar.css';

const TOOLBAR_ITEMS = [
    {
        id: MENU_ACTIONS.SORT,
        icon: 'fa-solid fa-sort',
        location: 'left',
    },
    {
        id: MENU_ACTIONS.NEW_FILE,
        icon: 'fa-solid fa-file-circle-plus',
        location: 'left',
    },
    {
        id: MENU_ACTIONS.NEW_DIR,
        icon: 'fa-solid fa-folder-plus',
        location: 'left',
    },
    {
        id: MENU_ACTIONS.DOWNLOAD,
        icon: 'fa-solid fa-file-arrow-down',
        location: 'left',
    },
    {
        id: MENU_ACTIONS.INFO,
        icon: 'fa-solid fa-circle-info',
        location: 'right',
    },
    {
        id: MENU_ACTIONS.REFRESH,
        icon: 'fa-solid fa-arrows-rotate',
        location: 'right',
    },
];


export default function ToolBar( {currentDirInfo, currentPath, humanizeFileSize, formatDate, handleClick, setSortMethod} ) {

    const { lang } = useTranslation();
    const infoPath = currentPath === '/' ? '/home' : `${currentPath}`;

    const leftItems = TOOLBAR_ITEMS.filter( (item) => item.location === 'left');
    const rightItems = TOOLBAR_ITEMS.filter( (item) => item.location === 'right');

    console.log(TOOLBAR_ITEMS)
    const renderItem = (item) =>  
        <div key={item.id} className="toolbar-item" onClick={() => handleClick(item.id)}>
            <i className={item.icon} />
            
            <div className="tooltip">
                {item.id === MENU_ACTIONS.INFO 
                    ? (
                    <>
                        <div className="info-line">{lang.files.toolBar.info.position}: {infoPath + '/'}</div>
                        <div className="info-line">{lang.files.toolBar.info.size}: {humanizeFileSize(currentDirInfo.size)}</div>
                        <div className="info-line">{lang.files.toolBar.info.lastModified}: {formatDate(currentDirInfo.lastModified)}</div>
                        <div className="info-line">{lang.files.toolBar.info.birthTime}: {formatDate(currentDirInfo.birthTime)}</div>
                    </>)
                    : (item.id === MENU_ACTIONS.SORT 
                        ? <SortTooltip setSortMethod={setSortMethod} /> 
                        : lang.files.actionItems[item.id])
                }
                
            </div>
        </div>



    return currentDirInfo && (
        <div className="toolbar-container">
            <div className="toolbar-items left">{ leftItems.map(renderItem) }</div>
            <div className="toolbar-items right">{ rightItems.map(renderItem) }</div>
        </div>
    )
}