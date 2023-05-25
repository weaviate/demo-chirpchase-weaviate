import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { TbPrompt } from "react-icons/tb";
import Select from "react-select";
import { customSelectStyles } from "./itemTypes";

interface InputCardProps {
  onSend: (text: string, tags: string[]) => void;
}

export const InputCard: React.FC<InputCardProps> = ({ onSend }) => {
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({});
  const firstKey = Object.keys(prompts)[0];
  const firstValue = prompts[firstKey];
  const [inputText, setInputText] = useState(firstValue);
  const [selectedPrompt, setSelectedPrompt] = useState(firstKey);
  const [contextTags, setContextTags] = useState<string[] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagChange = (
    selectedOptions: ReadonlyArray<{ label: string; value: string }> | null,
    actionMeta: any
  ) => {
    const values = selectedOptions?.map((option) => option.value) || [];
    setSelectedTags(values);
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

  const handlePromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrompt(e.target.value);
  };

  const handleClick = () => {
    onSend(inputText, selectedTags);
  };

  return (
    <div className="animate-pop-in table-container">
      <div className="relative p-4 mb-8 bg-zinc-900 text-gray-300 rounded-lg shadow-lg shadow-purple-500 neon-border-2">
        <div className="flex items-center mb-4">
          <TbPrompt className="mr-2"></TbPrompt>
          <p className="text-sm font-mono font-bold text-white">Prompt</p>
        </div>
        <div className="mb-2">
          <div className="flex space-x-2">
            <select
              value={selectedPrompt}
              onChange={handlePromptChange}
              className="w-full p-2 transition duration-150 ease-in-out bg-zinc-600 text-sm font-mono text-white rounded-lg focus:border-blue-300 focus:ring-1 focus:ring-blue-200"
            >
              {Object.keys(prompts).map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </select>

            <button
              onClick={handleClick}
              className="px-2 py-1 text-xs w-20 h-10 text-white bg-zinc-600 font-mono animate-pop-in-late rounded-lg focus:outline-none shadow-lg hover:bg-green-500"
            >
              Send
            </button>
          </div>
          <div className="flex items-center mt-2 mb-4 text-xs font-mono">
            <Select
              isMulti
              options={[
                ...(contextTags ?? []).map((tag) => ({
                  label: tag,
                  value: tag,
                })),
              ]}
              onChange={handleTagChange}
              placeholder="Add Context"
              styles={customSelectStyles}
            />
          </div>
        </div>
        <TextareaAutosize
          value={inputText}
          onChange={handleChange}
          className="w-full px-3 py-3 bg-zinc-800  text-white text-sm font-mono rounded-md custom-scrollbar"
        />
      </div>
    </div>
  );
};
