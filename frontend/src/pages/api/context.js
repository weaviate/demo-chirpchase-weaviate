// pages/api/context.js
import fs from 'fs';
import path from 'path';

export default (req, res) => {
    const contextDir = path.join(process.cwd(), 'data_api', 'contexts');
    const files = fs.readdirSync(contextDir);
    let contexts = {};

    files.forEach(file => {
        const filename = file.replace(".txt", "");
        const content = fs.readFileSync(path.join(contextDir, file), 'utf-8');
        contexts[filename] = content;
    });

    res.status(200).json(contexts);
};
