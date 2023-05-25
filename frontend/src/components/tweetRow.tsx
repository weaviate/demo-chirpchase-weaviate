import React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./itemTypes";
import { Tweet } from "./table";
import { AiFillHeart } from "react-icons/ai";

interface TweetRowProps {
  row: Tweet;
  index: number;
  onRowClick: (row: Tweet, index: number) => void;
}

export const TweetRow: React.FC<TweetRowProps> = ({
  row,
  index,
  onRowClick,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TWEET,
    item: { tweet: row },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    onRowClick(row, index);
  };

  return (
    <div
      ref={drag}
      onClick={handleClick}
      className={`animate-pop-in-late cursor-pointer block p-4 mr-3 mb-2 bg-zinc-800 border-2 border-zinc-600 mt-2 rounded-lg shadow-md hover:bg-zinc-600 transition-all duration-200 transform hover:z-5 relative ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex mb-2">
        <img
          src={row.profileImage}
          alt="Profile"
          className="w-12 h-12 mr-4 rounded-full"
        />
        <div className="flex-grow">
          <div className="font-bold text-md">{row.user}</div>
          <div className="text-xs font-thin">
            {new Date(row.date).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-start ml-2">
          <div className="text-sm">
            {row.likes} <AiFillHeart className="inline" />
          </div>
        </div>
      </div>
      <div className="text-sm font-mono h-20">{row.tweet}</div>
    </div>
  );
};
