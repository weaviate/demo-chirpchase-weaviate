export const ItemTypes = {
  TWEET: 'tweet',
};

export const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#52525B",
    borderColor: "#27272A",
    borderRadius: "8px",
    "&:hover": {
      borderColor: "#27272A",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#52525B",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#27272A"
      : state.isFocused
        ? "#2a2a2a"
        : "#52525B",
    color: "white",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#E811EF",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "white",
    "&:hover": {
      color: "white",
      backgroundColor: "#52525B",
    },
  }),
  input: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#A1A1AA",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "white",
  }),
};

export const getButtonClassName = (isSelected: boolean) => {
  return `px-2 py-1 text-xs font-mono w-20 h-10font-mono animate-pop-in-late rounded-lg shadow-lg transition duration-150 ease-in-out ${isSelected ? "bg-blue-400 text-white hover:bg-blue-300" : "bg-zinc-300 text-zinc-800 hover:bg-white"
    }`;
};