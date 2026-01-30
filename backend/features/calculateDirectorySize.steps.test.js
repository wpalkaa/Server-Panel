const fs = require('fs');
const path = require('path');
const { loadFeature, defineFeature } = require('jest-cucumber');
const { calculateDirectorySize } = require('../src/utils/files');


jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs'); // trzeba to bo inaczej cucumber się nie załaduje bo korzysta z fs

    return {
        ...actualFs,
        promises: {
            ...actualFs.promises, 
            readdir: jest.fn(), 
            stat: jest.fn(),     
        }
    };
});

const feature = loadFeature('./features/calculateDirectorySize.feature');

defineFeature(feature, test => {

    afterEach(() => jest.clearAllMocks());

    test('Directory is empty', ({ given, when, then }) => {
        let size;

        given('an empty directory', async () => {
            fs.promises.readdir.mockResolvedValue([]);
        });

        when('I calculate its size', async () => {
            size = await calculateDirectorySize('/dir');
        });

        then('the result should be 0', () => {
            expect(size).toBe(0);
        });
    });



    test('Directory with only files', ({ given, when, then }) => {
        let size;

        given('a directory with files of sizes 100 and 200', async () => {
            fs.promises.readdir.mockResolvedValue([
                { name: 'p1.txt', isDirectory: () => false },
                { name: 'p1.txt', isDirectory: () => false },
            ]);

            fs.promises.stat.mockResolvedValueOnce({ size: 100 })
            fs.promises.stat.mockResolvedValueOnce({ size: 200 });
        });

        when('I calculate its size', async () => {
            size = await calculateDirectorySize('/dir');
        });

        then('the result should be 300', () => {
            expect(size).toBe(300);
        });
    });


    
    test('Directory contains files and directories', ({ given, when, then }) => {
        let size;

        given('a directory with a file of size 67 and a subdirectory containing a file of size 1333', async () => {
            fs.promises.readdir.mockResolvedValueOnce([
                    { name: 'p1.txt', isDirectory: () => false },
                    { name: 'dir2', isDirectory: () => true },
                ])
            fs.promises.readdir.mockResolvedValueOnce([
                    { name: 'p2.txt', isDirectory: () => false }
                ]);

            fs.promises.stat.mockResolvedValueOnce({ size: 67 });
            fs.promises.stat.mockResolvedValueOnce({ size: 1333 });
        });

        when('I calculate its size', async () => {
            size = await calculateDirectorySize('/dir');
        });

        then('the result should be 1400', () => {
            expect(size).toBe(1400);
        });
    });

});
