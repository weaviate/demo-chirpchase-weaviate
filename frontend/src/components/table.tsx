import React, { useEffect, useState, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { TweetRow } from "./tweetRow";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineExplore } from "react-icons/md";
import { customSelectStyles } from "./itemTypes";

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
}

export const Table: React.FC<TableProps> = ({ onTweetSelect }) => {
  const [data, setData] = useState<Tweet[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
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

  const refreshData = async () => {
    const response = await fetch("http://localhost:8000/refresh");
    const jsonData = await response.json();
    setData(jsonData);
  };

  const handleSort = (key: keyof Tweet) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const handleUserSelect = (
    selectedOptions: ReadonlyArray<{ label: string; value: string }> | null,
    actionMeta: any
  ) => {
    const values = selectedOptions?.map((option) => option.value) || [];
    if (values.includes("all")) {
      setSelectedUser(null);
    } else {
      setSelectedUser(values);
    }
  };

  const handleTagSelect = (
    selectedOptions: ReadonlyArray<{ label: string; value: string }> | null,
    actionMeta: any
  ) => {
    const values = selectedOptions?.map((option) => option.value) || [];
    if (values.includes("all")) {
      setSelectedTags(null);
    } else {
      setSelectedTags(values);
    }
  };

  const handleRowClick = (row: Tweet, index: number) => {
    onTweetSelect(row.tweet);
    setSelectedRowIndex(index);
    window.open(row.url, "_blank");
  };

  const uniqueUsers = React.useMemo(() => {
    const userSet = new Set(data.map((tweet) => tweet.user));
    const users = Array.from(userSet) as string[];
    return users.sort();
  }, [data]);

  const uniqueTags = React.useMemo(() => {
    const tagSet = new Set(data.flatMap((tweet) => tweet.userTags));
    const tags = Array.from(tagSet) as string[];
    return tags.sort();
  }, [data]);

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

  const getButtonClassName = (isSelected: boolean) => {
    return `px-2 py-1 text-xs w-20 h-10 text-white font-mono animate-pop-in-late rounded-lg focus:outline-none shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
      isSelected ? "bg-green-500 " : "bg-zinc-600"
    } hover:bg-green-500`;
  };

  return (
    <div className="animate-pop-in table-container table_above">
      <div className="p-4 bg-zinc-900 text-gray-300 rounded-lg shadow-lg border-2 border-zinc-600">
        <div className="flex items-center mb-4">
          <MdOutlineExplore className="mr-2"></MdOutlineExplore>
          <p className="text-sm font-mono font-bold text-white">
            Tweet Explorer
          </p>
          <div></div>
        </div>
        <div className="relative w-full mb-4">
          <div className="flex space-x-2">
            <div className="flex items-center w-3/4 p-2 text-white bg-zinc-600 border border-gray-600 rounded shadow-lg">
              <AiOutlineSearch className="mr-2" />
              <input
                type="text"
                placeholder="Search tweets"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className=" w-full bg-transparent focus:outline-none text-sm font-mono"
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
            <button
            onClick={refreshData}
            className={`ml-auto px-2 py-1 text-xs w-20 h-10 text-white font-mono animate-pop-in-late rounded-lg focus:outline-none shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out bg-zinc-600 hover:bg-green-500`}
          >
            Refresh
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
              className="p-2 text-white bg-zinc-600 border border-gray-600 rounded font-mono text-xs"
            />
          </div>

          <div className="flex items-center mr-4 mt-3 text-xs font-mono">
            <Select
              isMulti
              options={[
                { label: "All users", value: "all" },
                ...uniqueUsers.map((user) => ({ label: user, value: user })),
              ]}
              placeholder="Select Users"
              onChange={handleUserSelect}
              styles={customSelectStyles}
            />
          </div>
          <div className="flex items-center mr-4 mt-3 text-xs font-mono">
            <Select
              isMulti
              options={[
                { label: "All tags", value: "all" },
                ...uniqueTags.map((tag) => ({ label: tag, value: tag })),
              ]}
              onChange={handleTagSelect}
              placeholder="Select Tags"
              styles={customSelectStyles}
            />
          </div>
          <div className="flex items-center mt-3 text-xs font-mono">
            <span className="text-white">
              Showing {filteredData.length} of {data.length} tweets
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
