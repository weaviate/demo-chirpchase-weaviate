import React, { useState, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { TbPrompt } from "react-icons/tb";

interface InputCardProps {
  onSend: (text: string, tags: string[], prompt: string) => void;
  context_dict: { [key: string]: string };
  prompt_dict: { [key: string]: string };
}

export const InputCard: React.FC<InputCardProps> = ({ onSend, context_dict, prompt_dict }) => {
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({});
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [contextTags, setContextTags] = useState<string[]>([]);

  const [inputText, setInputText] = useState(prompts[Object.keys(prompts)[0]]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [textareaExpanded, setTextareaExpanded] = useState(false);

  useEffect(() => {
    if (prompt_dict && Object.keys(prompt_dict).length > 0) {
      setPrompts(prompt_dict);
      setSelectedPrompt(Object.keys(prompt_dict)[0]);
    }
  }, [prompt_dict]);

  useEffect(() => {
    if (context_dict) {
      setContextTags(Object.keys(context_dict));
    }
  }, [context_dict]);

  const handleTagSelection = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    if (selectedPrompt) {
      setInputText(prompts[selectedPrompt]);
    }
  }, [selectedPrompt, prompts]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handlePromptSelection = (promptKey: string) => {
    setSelectedPrompt(promptKey);
  };

  const handleClick = () => {
    if (selectedPrompt) {
      onSend(inputText, selectedTags, selectedPrompt);
    }
  };

  const toggleTextArea = () => {
    setTextareaExpanded(!textareaExpanded);
  };

  return (
    <div className="animate-pop-in">
      <div className="relative p-4 mb-8 bg-zinc-200 text-zinc-800 rounded-lg shadow-lg border-dashed border-2 border-zinc-400">
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
                className={`cursor-pointer p-4 m-1 rounded-lg shadow-lg animate-pop-in-late flex justify-center transform transition-all duration-200 ${selectedPrompt === title ? 'bg-zinc-100 border-2 border-green-300' : 'bg-zinc-300 hover:bg-zinc-100'}`}
              >
                <span className="font-mono text-xs">
                  {title}
                </span>
              </div>
            ))}
          </div>
          <hr className="mt-2 bg-zinc-500" />
          <TextareaAutosize
            value={inputText}
            onChange={handleChange}
            className="w-full p-4 bg-zinc-300  text-zinc-800 font-mono text-xs rounded-md custom-scrollbar mt-4"
          />

          <hr className="my-4 bg-zinc-500" />
          <p className="text-xs font-mono text-zinc-800 mb-2">✨ Enhance the prompt with more context</p>
          <div className="grid grid-cols-2 gap-1 mt-2 mb-4 text-xs font-mono">
            {contextTags?.map((tag, index) => (
              <div
                key={index}
                onClick={() => handleTagSelection(tag)}
                className={`cursor-pointer p-3 m-2 rounded-lg animate-pop-in-late table-container shadow-lg text-center flex justify-center transform transition-all duration-200 hover:shadow-xl ${selectedTags.includes(tag) ? 'bg-zinc-100 border-2 border-green-300' : 'bg-zinc-300 hover:bg-zinc-100'}`}
              >
                <span className="font-mono text-xs">
                  {tag}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleClick}
              className="p-3 my-2 text-sm table-container text-zinc-800 bg-zinc-100 font-mono animate-pop-in-late rounded-lg focus:outline-none shadow-lg hover:bg-green-400 "
            >
              ⚙️ Generate
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default InputCard;
