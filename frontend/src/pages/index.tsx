import { Table, Tweet } from "../components/table";
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Dropzone } from "../components/dropzone";
import { InputCard } from "../components/inputCard";
import { OutputCard } from "../components/outputCard";
import { FaKiwiBird } from "react-icons/fa";

export default function Home() {
  const [selectedTweet, setSelectedTweet] = useState<string | null>(null);
  const [droppedTweets, setDroppedTweets] = useState<Tweet[]>([]);
  const [responseText, setResponseText] = useState<string[] | null>(null);
  const [keyText, setkeyText] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>("Offline");

  const handleTweetSelect = (tweet: string) => {
    setSelectedTweet(tweet);
  };

  const handleDrop = (tweet: Tweet) => {
    setDroppedTweets((prevTweets) => [...prevTweets, tweet]);
  };

  const handleClearDrop = () => {
    setDroppedTweets([]);
  };

  const handleDeleteTweet = (tweetId: string) => {
    setDroppedTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
  };

  const handleSend = async (inputText: string, tags: string[]) => {
    setIsLoading(true);

    const payload = {
      input_text: inputText,
      tags: tags,
      tweets: droppedTweets,
    };

    const response = await fetch("http://localhost:8000/process_tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const messages = Object.values(data) as string[];
    const keys = Object.keys(data) as string[];
    setResponseText(messages);
    setkeyText(keys);
    setIsLoading(false);
  };

  const checkApiHealth = async () => {
    try {
      const response = await fetch("http://localhost:8000/health");
      if (response.status === 200) {
        setApiStatus("Online");
      } else {
        setApiStatus("Offline");
      }
    } catch (error) {
      setApiStatus("Offline");
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <div className="min-h-screen">
      <DndProvider backend={HTML5Backend}>
        <div className="w-1/3 h-screen bg-zinc-100 fixed shadow-lg overflow-y-auto custom-scrollbar" style={{
          backgroundImage: "url('/sidebar.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div className="pt-8 title-container">
            <h1 className=" text-5xl text-zinc-800 flex items-center justify-center">
              <FaKiwiBird className="mr-4"></FaKiwiBird>
              <span className="font-bold text-green-500">
                Chirp
              </span>
              <span className="">Chase</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-800 font-mono flex justify-center">
              Analyze and leverage content generation
            </p>
            <div className="mt-4 text-xs text-zinc-900 font-mono flex justify-center">
              <span className="rounded-indicator">v0.1.3</span>
              <span className="rounded-indicator">API: {apiStatus}</span>
            </div>
          </div>
          <div className="pt-6 px-12">
            <InputCard onSend={handleSend} />
            <div className="mt-4">
              <Dropzone onDrop={handleDrop} onClear={handleClearDrop} onDelete={handleDeleteTweet} />
            </div>
          </div>
        </div>
        <div
          className="w-2/3 ml-auto min-h-screen overflow-y-auto custom-scrollbar"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container pt-8 px-8 custom-scrollbar">
            <div className="w-full">
              <Table onTweetSelect={handleTweetSelect} />
              <div className="mt-4">
                <OutputCard
                  output={responseText}
                  keys={keyText}
                  isLoading={isLoading}
                ></OutputCard>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}
