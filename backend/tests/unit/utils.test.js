const fs = require('fs');
const path = require('path');

const { isNameValid, getTargetPath, calculateDirectorySize } = require('../../src/utils/files');

jest.mock('fs', () => ({
    promises: {
        access: jest.fn(),
        readdir: jest.fn(),
        stat: jest.fn(),
    },
    constants: {
        F_OK: jest.fn()
    }
}));





describe('Utils', () => {

    describe('isNameValid', () => {
        describe('False', () => {
            it('Empty or whitespace-only names', () => {
                expect(isNameValid('')).toBe(false);
                expect(isNameValid('   ')).toBe(false);
                expect(isNameValid(null)).toBe(false);
            });
    
            it('Illegal symbols', () => {
                expect(isNameValid('file/name')).toBe(false);
                expect(isNameValid('file<name>')).toBe(false);
                expect(isNameValid('#!#%#Q#F#@<SCRIPT>|name')).toBe(false);
            });
            
        })
        describe('True', () => {
            it('Valid names', () => {
                expect(isNameValid('file.txt')).toBe(true);
                expect(isNameValid('katalogZPudzianem')).toBe(true);
                expect(isNameValid('.hidden')).toBe(true);
            });
        })
    });

    describe('getTargetPath', () => {
        const fileSystemPath = '\home';

        afterEach(() => jest.clearAllMocks());

        it('returns fileSystemPath if path is /home', async () => {
            const result = await getTargetPath('/home', fileSystemPath);
            
            expect(result).toBe(fileSystemPath);
        });

        it('400 if no path was provided', async () => {
            await expect(getTargetPath('', fileSystemPath))
                .rejects.toMatchObject({ status: 400, message: "noPath" });
        });

        it('400 if path tries to escape base folder', async () => {
            await expect(getTargetPath('../../../../../.env', fileSystemPath))
                .rejects.toMatchObject({ status: 400, message: "invalidDirectoryPath" });
        });

        it('404 if mustExist is true but file does not exist', async () => {
            fs.promises.access.mockRejectedValue(new Error());
            await expect(getTargetPath('/p1.txt', fileSystemPath))
                .rejects.toMatchObject({ status: 404, message: 'fileDoesNotExist' });
        });

        it('409 if mustExist is false but file exists', async () => {
            fs.promises.access.mockResolvedValue();
            await expect(getTargetPath('/p1.txt', fileSystemPath, { mustExist: false }))
                .rejects.toMatchObject({ status: 409, message: 'fileExists' });
        });

        it('returns correct path if file exists and mustExist=true', async () => {
            fs.promises.access.mockResolvedValue();
            const result = await getTargetPath('/p1.txt', fileSystemPath, { mustExist: true });
            
            expect(result).toBe(path.join(fileSystemPath, '/p1.txt'));
        });

        it('returns correct path if file does not exist and mustExist=false', async () => {
            fs.promises.access.mockRejectedValue(new Error());
            const result = await getTargetPath('/p1.txt', fileSystemPath, { mustExist: false });
            
            expect(result).toBe(path.join(fileSystemPath, '/p1.txt'));
        });
    });
});
