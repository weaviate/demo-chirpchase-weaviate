import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { TbWriting } from "react-icons/tb";

interface ContentCreatorProp {
  onAddTweetContent: (content: string) => void;
}

export const ContentCreator: React.FC<ContentCreatorProp> = ({ onAddTweetContent }) => {

  const [text, setText] = useState("");
  const handleAddButtonClick = () => {
    onAddTweetContent(text);
    setText(''); // clear the text area
  };

  return (
    <div className="animate-pop-in table_above">
      <div className="p-4 bg-zinc-200 mb-4 text-gray-300 rounded-lg shadow-lg border-2 border-dashed border-zinc-400">
        <div className="flex items-center mb-4">
          <TbWriting className="mr-2 text-zinc-800"></TbWriting>
          <p className="text-sm font-mono font-bold text-zinc-800">Input</p>
        </div>
        <div>
          <div className="flex flex-col h-full p-2 rounded-lg shadow-lg bg-zinc-100">
            <TextareaAutosize
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-1 bg-zinc-100 text-zinc-800 rounded-md font-mono text-sm custom-scrollbar"
              placeholder="Write here..."
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-8 py-3 text-xs font-mono text-zinc-800 bg-zinc-300 rounded-lg shadow-lg hover:bg-zinc-100 table-container"
              onClick={handleAddButtonClick}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



