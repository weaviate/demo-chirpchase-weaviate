import React, { useState, useEffect } from "react";
import { MdOutput, MdCached } from "react-icons/md";
import Typewriter from 'typewriter-effect';

interface OutputCardProps {
  data: OutputEntry | null;
  cache: CacheResponse;
  isLoading: boolean;
}

export interface OutputEntry {
  [key: string]: string;
}

export interface CacheResponse {
  [timestamp: string]: OutputEntry;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  data,
  isLoading,
  cache
}) => {

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({
    "📝 Prompt": true,
    "📝 Input": true,
  });
  const [outputData, setOutputData] = useState<OutputEntry | null>(data);

  useEffect(() => {
    setOutputData(data);
  }, [data]);

  const handleToggleCollapse = (key: string) => {
    setCollapsed(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  return (
    <div className="animate-pop-in">
      <div className="relative flex max-h-[55vh] bg-zinc-200 rounded-lg shadow-lg border-2 border-zinc-400 border-dashed mb-4">
        <div className="w-2/3 overflow-x-auto">
          <div className="relative p-4 mb-8 bg-zinc-200 text-gray-300  rounded-lg">
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
                outputData &&
                Object.entries(outputData).map(([key, text], index) => (
                  <div
                    key={index}
                    className="p-2 m-2 bg-zinc-100 rounded-md text-sm font-mono text-zinc-800 animate-pop-in-late table-container"
                  >
                    <div className="flex items-start flex-col">
                      {key === "📝 Prompt" || key === "📝 Input" ? (
                        // Collapsible section for "Prompt" or "Input" keys
                        <>
                          <div
                            className="cursor-pointer"
                            onClick={() => handleToggleCollapse(key)}
                          >
                            <p className="font-bold text-xs">
                              {collapsed[key] ? "▶" : "▼"} {key}
                            </p>
                          </div>
                          {!collapsed[key] && (
                            <div>
                              <p className="text-xs ml-2 p-2 font-mono font-sm">
                                {text}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        // Regular output entry
                        <>
                          <div className="font-mono text-xs text-zinc-800">
                            <p className="font-bold">{key}</p>
                            <Typewriter
                              key={text + key}
                              onInit={(typewriter) => {
                                typewriter.typeString(text || 'N/A').start();
                              }}
                              options={{ delay: 15, }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="w-1/3 overflow-x-auto">
          <div className="relative p-4 mb-8 bg-zinc-200 text-gray-300">
            <div className="flex items-center mb-4">
              <MdCached className="mr-2 text-zinc-800"></MdCached>
              <p className="text-sm font-mono font-bold text-zinc-800">
                Cache
              </p>
            </div>
            <div>
              {Object.keys(cache).length > 0 ? (
                Object.entries(cache).reverse().map(([timestamp, outputEntry], index) => (
                  <div
                    key={`cached_${index}`}
                    className="p-2 m-2 bg-zinc-300 rounded-md text-sm font-mono text-zinc-800 animate-pop-in-late table-container hover:bg-white"
                    onClick={() => {
                      setOutputData(outputEntry);
                    }}
                  >
                    <p className="font-bold text-xs">{timestamp}</p>
                  </div>
                ))
              ) : (
                <p>No cached outputs available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};