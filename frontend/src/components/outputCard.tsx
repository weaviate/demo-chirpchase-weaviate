import React from "react";
import { MdOutput } from "react-icons/md";

interface OutputCardProps {
  output: string[] | null;
  keys: string[] | null;
  isLoading: boolean;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  output,
  keys,
  isLoading,
}) => {
  return (
    <div className="animate-pop-in">
      <div className="relative p-4 mb-8 bg-zinc-200 text-gray-300  rounded-lg shadow-lg border-2 border-blue-400 border-dashed">
        <div className="flex items-center mb-4">
          {/* Title */}
          <MdOutput className="mr-2 text-zinc-800"></MdOutput>
          <p className="text-sm font-mono font-bold text-zinc-800">Output</p>
        </div>
        <div>
          {isLoading ? (
            <div
              key={"Loading"}
              className="p-2 m-2 bg-zinc-100 rounded-md text-xs font-mono text-zinc-800 animate-pop-in-late table-container"
            >
              <div className="flex items-center">
                <p className="font-bold text-zinc-800">✨ Loading!</p>
                <p className="ml-2 p-2 font-mono font-sm text-zinc-800">
                  Please wait
                </p>
              </div>
            </div>
          ) : (
            output &&
            keys &&
            output.map((text, index) => (
              <div
                key={index}
                className="p-2 m-2 bg-zinc-100 rounded-md text-sm font-mono text-zinc-800 animate-pop-in-late table-container"
              >
                <div className="flex items-center">
                  <p className="font-bold text-xs ">{keys[index]}</p>
                  <p className="text-xs ml-2 p-2 font-mono font-sm ">
                    {text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
