// pages/api/prompts.js
import fs from 'fs';
import path from 'path';

export default (req, res) => {
  const promptsDir = path.join(process.cwd(), 'data_api', 'prompts');
  const files = fs.readdirSync(promptsDir);
  let prompts = {};

  files.forEach(file => {
    const filename = file.replace(".txt", "");
    const content = fs.readFileSync(path.join(promptsDir, file), 'utf-8');
    prompts[filename] = content;
  });

  res.status(200).json(prompts);
};
