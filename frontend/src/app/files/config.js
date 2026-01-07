export const MENU_ACTIONS = {
    OPEN: 'open',
    NEW_FILE: 'newFile',
    NEW_DIR: 'newDir',
    DOWNLOAD: 'download',
    RENAME: 'rename',
    DELETE: 'delete',    
    SORT: 'sort',
    INFO: 'info',
    REFRESH: 'refresh',
};

export const BACKGROUND_ITEMS = [
    { id: MENU_ACTIONS.NEW_FILE,    label: 'Nowy Plik',          handle: 'handleNewFile',    styles: { color: 'green' } },
    { id: MENU_ACTIONS.NEW_DIR,     label: 'Nowy Folder',        handle: 'handleNewDir',     styles: { color: 'green' } },
    { id: MENU_ACTIONS.DOWNLOAD,    label: 'Pobierz',            handle: 'handleDownload',   styles: {} },
    { id: 'size',                   label: 'Rozmiar: ',          handle: 'null',             styles: {} },
    { id: 'mDate',                  label: 'Data modyfikacji: ', handle: 'null',             styles: {} },
    { id: 'birthTime',              label: 'Data utworzenia: ',  handle: 'null',             styles: {} },

];
export const MENU_ITEMS = [
    { id: MENU_ACTIONS.OPEN,      label: 'Otwórz',            handle: 'handleOpen',        styles: {} },
    { id: MENU_ACTIONS.NEW_FILE,    label: 'Nowy Plik',          handle: 'handleNewFile',    styles: { color: 'green' } },
    { id: MENU_ACTIONS.NEW_DIR,     label: 'Nowy Folder',        handle: 'handleNewDir',     styles: { color: 'green' } },
    { id: MENU_ACTIONS.RENAME,    label: 'Zmień nazwę',       handle: 'handleRename',      styles: {} },
    { id: MENU_ACTIONS.DOWNLOAD,    label: 'Pobierz',            handle: 'handleDownload',   styles: {} },
    { id: MENU_ACTIONS.DELETE,    label: 'Usuń',              handle: 'handleDelete',      styles: { color: 'red' } },
    { id: 'size',                   label: 'Rozmiar: ',          handle: 'null',             styles: {} },
    { id: 'mDate',                  label: 'Data modyfikacji: ', handle: 'null',             styles: {} },
    { id: 'birthTime',              label: 'Data utworzenia: ',  handle: 'null',             styles: {} },

];

export const MODAL = {
    CREATE: "create",
    RENAME: "rename",
    DELETE: "delete",
};