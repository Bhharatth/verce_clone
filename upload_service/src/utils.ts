import fs from 'fs';
import path from 'path';
export const generateRandomId = () => {
    const length = 5;
    const elements = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let str = '';
    for (let i = 0; i < length; i++) {
        str += elements[Math.floor(Math.random() * elements.length)]
    }

    if (str.length === 0) {
        return
    }

    return str;
};

export const getAllfiles = (folderpath: string) => {
    let response: string[] = []
    const fileList = fs.readdirSync(folderpath);

    fileList.forEach(file => {
        // const filename = `${folderpath}/${file}`;
        const fullpath = path.join(folderpath, file);

        if (fs.statSync(fullpath).isDirectory()) {
            response = response.concat(getAllfiles(fullpath))

        } else {
            response.push(fullpath);
        }
    })
    return response;
}
