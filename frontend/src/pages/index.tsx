import { ContentCreator } from "../components/contentcreator";
import React, { useState, useEffect } from "react";
import { Dropzone, Tweet } from "../components/dropzone";
import { InputCard } from "../components/inputCard";
import { OutputCard, OutputEntry, CacheResponse } from "../components/outputCard";
import { FaKiwiBird } from "react-icons/fa";

export default function Home() {
  const [droppedTweets, setDroppedTweets] = useState<Tweet[]>([]);
  const [responseData, setResponseData] = useState<OutputEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contexts, setContexts] = useState<{ [key: string]: string }>({});
  const [prompts, setPrompts] = useState<{ [key: string]: string }>({});

  const [cache, setCache] = useState<CacheResponse>({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/context");
      const jsonData = await response.json();
      setContexts(jsonData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/prompts");
      const jsonData = await response.json();
      setPrompts(jsonData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Initialize the cache from localStorage on component mount
    const existingCache: CacheResponse = JSON.parse(localStorage.getItem("cache") || "{}");
    setCache(existingCache);

  }, []);

  const handleDeleteTweet = (tweetId: string) => {
    setDroppedTweets((prevTweets) => prevTweets.filter((tweet) => tweet.id !== tweetId));
  };

  const handleSend = async (inputText: string, tags: string[], prompt: string) => {
    setIsLoading(true);

    const payload = {
      input_text: inputText,
      tags: tags,
      prompt: prompt,
      contexts: contexts,
      tweets: droppedTweets,
    };

    // Note: Change the endpoint to your Next.js API route
    const response = await fetch("/api/generation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setResponseData(data);
    setIsLoading(false);

    try {
      const timestamp = new Date().toISOString() + " " + prompt;
      const existingCache: CacheResponse = JSON.parse(localStorage.getItem("cache") || "{}");
      existingCache[timestamp] = data;

      localStorage.setItem("cache", JSON.stringify(existingCache));

      // Update the cache state
      setCache(existingCache);

    } catch (error) {
      console.error("Failed to save to cache:", error);
      // Handle the error appropriately, maybe inform the user, etc.
    }
  };

  const handleAddTweetContent = (content: string) => {
    setDroppedTweets((prevTweets) => [...prevTweets, {
      id: Math.random().toString(), // you can replace this with a more unique ID generation method
      user: 'User Name', // replace this with the user name
      tweet: content,
      likes: 0,
      date: new Date().toISOString(),
      profileImage: '', // add a profile image URL here
      url: '', // add a tweet URL here
      userTags: [], // add user tags if any
    }]);
  };

  return (
    <div className="min-h-screen">

      <div className="w-1/3 h-screen bg-zinc-50 fixed shadow-lg overflow-y-auto custom-scrollbar"
      >
        <div className="pt-8 title-container">
          <h1 className=" text-5xl text-zinc-800 flex items-center justify-center">
            <FaKiwiBird className="mr-4"></FaKiwiBird>
            <span className="font-bold text-green-500">
              Chirp
            </span>
            <span className="">Chase</span>
          </h1>
          <div className="mt-2 text-xs text-zinc-900 font-mono flex justify-center">
            <p className="text-sm text-zinc-800 font-mono mr-4 mt-1">
              Analyze and leverage content generation
            </p>
            <span className="rounded-indicator">v0.2.0</span>
          </div>
        </div>
        <div className="pt-6 px-12">
          <ContentCreator onAddTweetContent={handleAddTweetContent} />
          <InputCard onSend={handleSend} context_dict={contexts} prompt_dict={prompts} />
        </div>
      </div>
      <div
        className="w-2/3 ml-auto min-h-screen dot-grid overflow-y-auto custom-scrollbar bg-zinc-100"
      >
        <div className="container pt-8 px-8 custom-scrollbar">
          <div className="w-full">
            <div className="min-h-[10vh]">

            </div>
            <Dropzone onDelete={handleDeleteTweet} droppedTweets={droppedTweets} />
            <OutputCard
              data={responseData}
              isLoading={isLoading}
              cache={cache}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
