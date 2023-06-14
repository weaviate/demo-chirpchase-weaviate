import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./itemTypes";
import { Tweet } from "./table";
import { TbDragDrop } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";

interface DropzoneProps {
  onDrop: (tweet: Tweet) => void;
  onDelete: (tweetId: string) => void;
  droppedTweets: Tweet[];
}

export const Dropzone: React.FC<DropzoneProps> = ({ onDrop, onDelete, droppedTweets }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
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

  useEffect(() => {
    setTweets(droppedTweets);
  }, [droppedTweets]);

  return (
    <div className="animate-pop-in">
      <div className="relative p-4 mb-4 bg-zinc-200 text-gray-300  rounded-lg shadow-lg border-2 border-dashed border-zinc-400">
        <div className="flex items-center mb-4">
          <TbDragDrop className="mr-2 text-zinc-800"></TbDragDrop>
          <p className="text-sm font-mono font-bold text-zinc-800">Content Dropzone</p>
        </div>
        <div
          ref={drop}
          className="w-full min-h-[100px] p-4 mb-4 bg-zinc-300 rounded-lg text-zinc-400 text-xs font-mono"
        >
          {tweets.length === 0 ? (
            <p>Drop your content here</p>
          ) : (
            tweets.map((tweet, index) => (
              <div
                key={index}
                className="relative my-2 p-4 bg-zinc-100 text-zinc-800 rounded-lg shadow-md"
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
