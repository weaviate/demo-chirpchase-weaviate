import React, { useEffect, useState, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { TweetRow } from "./tweetRow";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineExplore, MdCreate } from "react-icons/md";
import { getButtonClassName } from "./itemTypes";
import TextareaAutosize from "react-textarea-autosize";

export interface Tweet {
  id: string;
  user: string;
  tweet: string;
  likes: number;
  date: string;
  profileImage: string;
  url: string;
  userTags: string[];
}

interface TableProps {
  onTweetSelect: (tweet: string) => void;
  onAddTweetContent: (content: string) => void;
}

export const Table: React.FC<TableProps> = ({ onTweetSelect, onAddTweetContent }) => {
  const [data, setData] = useState<Tweet[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [tab, setTab] = useState<"explorer" | "creator">("explorer");
  const [selectedUser, setSelectedUser] = useState<string[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[] | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Tweet | null;
    direction: "descending" | "ascending";
  }>({
    key: "likes",
    direction: "descending",
  });
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/tweets");
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const latestDate = data.reduce((latest, tweet) => {
        const tweetDate = new Date(tweet.date);
        return tweetDate > latest ? tweetDate : latest;
      }, new Date(0));
      setSelectedDate(latestDate);
    }
  }, [data]);

  const handleSort = (key: keyof Tweet) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const ContentCreator: React.FC = () => {
    const [text, setText] = useState("");

    const handleAddButtonClick = () => {
      onAddTweetContent(text);
      setText(''); // clear the text area
    };

    return (
      <div>
        <div className="flex flex-col h-full p-2 rounded shadow-lg bg-zinc-100">
          <TextareaAutosize
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-1 bg-zinc-100 text-zinc-800 rounded-md font-mono text-sm custom-scrollbar"
            placeholder="Write here..."
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="px-8 py-3 text-xs font-mono text-zinc-800 bg-zinc-300 rounded-lg shadow-lg hover:bg-blue-400 hover:text-white"
            onClick={handleAddButtonClick}
          >
            Add
          </button>
        </div>
      </div>
    );
  };

  const handleRowClick = (row: Tweet, index: number) => {
    onTweetSelect(row.tweet);
    setSelectedRowIndex(index);
    window.open(row.url, "_blank");
  };

  const listRef = useRef<List>(null);

  const filteredData = React.useMemo(() => {
    return sortedData.filter((tweet) => {
      const dateFilter =
        !selectedDate ||
        (new Date(tweet.date).getDate() === selectedDate.getDate() &&
          new Date(tweet.date).getMonth() === selectedDate.getMonth() &&
          new Date(tweet.date).getFullYear() === selectedDate.getFullYear());

      const userFilter = !selectedUser || selectedUser.includes(tweet.user);

      const searchFilter =
        searchQuery === "" ||
        tweet.tweet.toLowerCase().includes(searchQuery.toLowerCase());

      const tagFilter =
        !selectedTags ||
        tweet.userTags.some((tag) => selectedTags.includes(tag));

      return dateFilter && userFilter && searchFilter && tagFilter;
    });
  }, [sortedData, selectedDate, selectedUser, searchQuery, selectedTags]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const row = filteredData[index];
    return (
      <div style={{ ...style, overflow: "hidden" }}>
        <table className="w-full">
          <tbody>
            <TweetRow
              key={`${row.user}-${index}`}
              row={row}
              index={index}
              onRowClick={handleRowClick}
            />
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="animate-pop-in table_above">
      <div className="p-4 bg-zinc-200 text-gray-300 rounded-lg shadow-lg border-2 border-dashed border-blue-400">
        <div className="flex items-center mb-4">
          <div className="flex mb-4">
            <button
              className={`mr-4  ${tab === "explorer" ? "text-zinc-800" : "text-zinc-400"}`}
              onClick={() => setTab("explorer")}
            >
              <div className={`flex table-container rounded-lg shadow-md p-3 ${tab === "explorer" ? "bg-white" : "text-zinc-400"}`}>
                <MdOutlineExplore className="mr-2"></MdOutlineExplore>
                <p className='text-sm font-mono font-bold'>Explorer</p>
              </div>
            </button>

            <button
              className={`mr-4  ${tab === "creator" ? "text-zinc-800" : "text-zinc-400"}`}
              onClick={() => setTab("creator")}
            >
              <div className={`flex table-container rounded-lg shadow-md p-3 ${tab === "creator" ? "bg-white" : "text-zinc-400"}`}>
                <MdCreate className="mr-2"></MdCreate>
                <p className='text-sm font-mono font-bold'>Creator</p>
              </div>
            </button>
          </div>
        </div>

        {tab === "explorer" ? (
          <div>
            <div className="relative w-full mb-4">
              <div className="flex space-x-2">
                <div className="flex items-center w-3/4 p-2 text-white bg-zinc-100 rounded shadow-lg">
                  <AiOutlineSearch className="mr-2 text-zinc-800" />
                  <input
                    type="text"
                    placeholder="Search tweets"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className=" w-full bg-transparent focus:outline-none text-sm font-mono py-1 text-zinc-800"
                  />
                </div>
                <button
                  onClick={() => handleSort("date" as keyof Tweet)}
                  className={getButtonClassName(sortConfig.key === "date")}
                >
                  Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSort("likes" as keyof Tweet)}
                  className={`${getButtonClassName(
                    sortConfig.key === "likes"
                  )} ml-2`}
                >
                  Likes{" "}
                  {sortConfig.key === "likes" &&
                    (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-auto mb-1 rounded-lg">
              <div style={{ width: "100%" }}>
                <List
                  ref={listRef}
                  height={300}
                  itemCount={filteredData.length}
                  itemSize={180}
                  width="100%"
                  className="custom-scrollbar"
                >
                  {Row}
                </List>
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center mr-4 mt-3">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  dateFormat="yyyy/MM/dd"
                  isClearable
                  placeholderText="Select date"
                  className="p-2 bg-zinc-300 rounded font-mono text-xs text-zinc-800"
                />
              </div>
              <div className="flex items-center mt-3 text-xs font-mono">
                <span className="text-zinc-800">
                  Showing {filteredData.length} of {data.length} tweets
                </span>
              </div>
            </div>
          </div>) : (
          <ContentCreator />
        )}
      </div>
    </div>
  );
};
