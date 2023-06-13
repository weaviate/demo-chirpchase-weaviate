import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { TbPrompt } from "react-icons/tb";
import Select from "react-select";
import { customSelectStyles } from "./itemTypes";

interface InputCardProps {
  onSend: (text: string, tags: string[], prompt: string) => void;
}

export const InputCard: React.FC<InputCardProps> = ({ onSend }) => {
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({});
  const [inputText, setInputText] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [contextTags, setContextTags] = useState<string[] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [textareaExpanded, setTextareaExpanded] = useState(false);

  const handleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/context");
      const jsonData = await response.json();
      setContextTags(Object.keys(jsonData));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/prompts");
      const jsonData = await response.json();
      setPrompts(jsonData);
      const firstKey = Object.keys(jsonData)[0];
      setSelectedPrompt(firstKey);
      setInputText(jsonData[firstKey]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setInputText(prompts[selectedPrompt]);
  }, [selectedPrompt]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handlePromptSelection = (promptKey: string) => {
    setSelectedPrompt(promptKey);
  };

  const handleClick = () => {
    onSend(inputText, selectedTags, selectedPrompt);
  };

  const toggleTextArea = () => {
    setTextareaExpanded(!textareaExpanded);
  };

  return (
    <div className="animate-pop-in">
      <div className="relative p-4 mb-8 bg-zinc-200 text-zinc-800 rounded-lg shadow-lg border-dashed border-2 border-green-400">
        <div className="flex items-center mb-4">
          <TbPrompt className="mr-2"></TbPrompt>
          <p className="text-sm font-mono font-bold text-zinc-800">Persona Prompt</p>
        </div>
        <div className="mb-2">
          <p className="text-xs font-mono text-zinc-800 mb-2">🗿 Select a persona prompt to generate content</p>
          <div className="grid grid-cols-3 gap-1">
            {Object.keys(prompts).map((title, index) => (
              <div
                key={index}
                onClick={() => handlePromptSelection(title)}
                className={`cursor-pointer p-9 m-2 rounded-lg shadow-lg  animate-pop-in-late table-container flex justify-center transform transition-all duration-200 hover:shadow-xl ${selectedPrompt === title ? 'bg-green-400 text-white' : 'bg-zinc-300 hover:bg-zinc-100'}`}
              >
                <span className="font-mono text-xs">
                  {title}
                </span>
              </div>
            ))}
          </div>
          <hr className="my-4 bg-zinc-500" />
          <p className="text-xs font-mono text-zinc-800 mb-2">🛰️ Enhance the prompt with more context</p>
          <div className="grid grid-cols-2 gap-1 mt-2 mb-4 text-xs font-mono">
            {contextTags?.map((tag, index) => (
              <div
                key={index}
                onClick={() => handleTagSelection(tag)}
                className={`cursor-pointer p-3 m-2 rounded-lg animate-pop-in-late table-container shadow-lg text-center flex justify-center transform transition-all duration-200 hover:shadow-xl ${selectedTags.includes(tag) ? 'bg-blue-400 text-white' : 'bg-zinc-300 hover:bg-zinc-100'}`}
              >
                <span className="font-mono text-xs">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-4 bg-zinc-500" />
        <button
          onClick={toggleTextArea}
          className="w-full text-xs text-zinc-800 bg-zinc-300 p-3 font-mono animate-pop-in-late table-container rounded-lg focus:outline-none shadow-lg hover:bg-zinc-100"
        >
          {textareaExpanded ? 'Hide prompt' : 'Edit prompt'}
        </button>
        {textareaExpanded && (
          <TextareaAutosize
            value={inputText}
            onChange={handleChange}
            className="w-full p-4 bg-zinc-300  text-zinc-800 font-mono text-xs rounded-md custom-scrollbar mt-4"
          />
        )}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleClick}
            className="p-3 my-2 text-sm text-zinc-800 bg-zinc-100 font-mono animate-pop-in-late rounded-lg focus:outline-none shadow-lg hover:bg-green-400 hover:text-white"
          >
            ⚙️ Generate
          </button>
        </div>
      </div>

    </div>
  );
};

export default InputCard;
