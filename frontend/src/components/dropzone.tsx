import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./itemTypes";
import { Tweet } from "./table";
import TextareaAutosize from "react-textarea-autosize";
import { TbDragDrop } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";

interface DropzoneProps {
  onDrop: (tweet: Tweet) => void;
  onClear: () => void;
  onDelete: (tweetId: string) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onDrop, onClear, onDelete }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [customTweet, setCustomTweet] = useState("");
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.TWEET,
    drop: (item: any, monitor) => {
      setTweets((prev) => [...prev, item.tweet]);
      onDrop(item.tweet);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const deleteTweet = (indexToDelete: number) => {
    const tweetToDelete = tweets[indexToDelete];
    setTweets(tweets.filter((_, index) => index !== indexToDelete));
    onDelete(tweetToDelete.id);
  };

  const addCustomTweet = () => {
    if (customTweet.trim()) {
      const newTweet: Tweet = {
        id: new Date().toISOString(),
        user: "Custom User",
        tweet: customTweet,
        likes: 0,
        profileImage: "",
        userTags: [""],
        url: "",
        date: new Date().toISOString(),
      };

      setTweets((prev) => [...prev, newTweet]);
      onDrop(newTweet);
      setCustomTweet("");
    }
  };

  return (
    <div className="animate-pop-in table-container">
      <div className="relative p-4 mb-8 bg-zinc-900 text-gray-300  rounded-lg shadow-lg shadow-green-400 neon-border">
        <div className="flex items-center mb-4">
          <TbDragDrop className="mr-2"></TbDragDrop>
          <p className="text-sm font-mono font-bold text-white">Dropzone</p>
        </div>
        <div className="mb-2">
          <div className="flex space-x-2">
            <TextareaAutosize
              value={customTweet}
              onChange={(e) => setCustomTweet(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-600 rounded-md font-mono text-sm custom-scrollbar"
              placeholder="Type custom tweet here"
            />
            <button
              onClick={addCustomTweet}
              className="px-2 py-1 text-xs w-20 h-10 text-white bg-zinc-600 font-mono animate-pop-in-late rounded-lg focus:outline-none shadow-lg hover:bg-green-500 "
            >
              Add
            </button>
          </div>
        </div>
        <div
          ref={drop}
          className="w-full min-h-[100px] p-4 mb-4 bg-zinc-600 rounded-lg text-zinc-400 text-sm font-mono"
        >
          {tweets.length === 0 ? (
            <p>Drop your tweets here</p>
          ) : (
            tweets.map((tweet, index) => (
              <div
                key={index}
                className="relative my-2 p-4 bg-zinc-800 text-white rounded-lg shadow-md"
              >
                <p>{tweet.tweet}</p>
                <button
                  className="absolute top-2 right-2 px-1 py-1 text-xs text-white bg-red-500 rounded-full hover:bg-red-600"
                  onClick={() => deleteTweet(index)}
                >
                  <AiFillDelete></AiFillDelete>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};