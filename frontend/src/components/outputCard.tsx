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
    <div className="animate-pop-in table-container">
      <div className="relative p-4 mb-8 bg-zinc-900 text-gray-300  rounded-lg shadow-lg border-2 border-zinc-700">
        <div className="flex items-center mb-4">
          {/* Title */}
          <MdOutput className="mr-2"></MdOutput>
          <p className="text-sm font-mono font-bold text-white">Output</p>
        </div>
        <div>
          {isLoading ? (
            <div
              key={"Loading"}
              className="p-2 m-2 bg-zinc-700 rounded-md text-sm font-mono text-white animate-pop-in-late table-container"
            >
              <div className="flex items-center">
                <p className="font-bold text-white">✨ Loading!</p>
                <p className="text-sm ml-2 p-2 font-mono font-sm text-white">
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
                className="p-2 m-2 bg-zinc-700 rounded-md text-sm font-mono text-white animate-pop-in-late table-container"
              >
                <div className="flex items-center">
                  <p className="font-bold text-xs text-white">{keys[index]}</p>
                  <p className="text-sm ml-2 p-2 font-mono font-sm text-white">
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
