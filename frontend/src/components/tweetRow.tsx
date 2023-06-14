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
      className={`animate-pop-in-late text-zinc-800 cursor-pointer block p-4 mr-3 mb-2 bg-zinc-100 border-2  mt-2 rounded-lg shadow-md hover:bg-white transition-all duration-200 transform hover:z-5 relative ${isDragging ? "opacity-50" : ""
        }`}
    >
      <div className="flex mb-2">
        <img
          src={row.profileImage}
          alt="Profile"
          className="w-10 h-10 mr-4 rounded-full"
        />
        <div className="flex-grow">
          <div className="font-bold text-sm">{row.user}</div>
          <div className="text-xs font-thin">
            {new Date(row.date).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-start ml-2">
          <div className="text-xs">
            {row.likes} <AiFillHeart className="inline" />
          </div>
        </div>
      </div>
      <div className="text-xs font-mono h-20">{row.tweet}</div>
    </div>
  );
};
