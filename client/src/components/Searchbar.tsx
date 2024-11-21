import React, { Dispatch, SetStateAction } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchbarProps {
  searchedNoteTitle: string;
  setSearchedNote: Dispatch<SetStateAction<string>>;
}
function Searchbar({ searchedNoteTitle, setSearchedNote }: SearchbarProps) {
  return (
    <div className="w-full rounded-md h-[45px] flex shadow shadow-black mt-2 gap-2 items-center px-2 relative z-10">
      <label htmlFor="searchbox-notes" className=" text-xl px-1">
        {" "}
        <CiSearch />
      </label>
      <input
        onChange={(e) => {
          setSearchedNote((prev) => e.target.value);
        }}
        value={searchedNoteTitle}
        autoComplete="off"
        id="searchbox-notes"
        type="text"
        placeholder="Search your Notes"
        className="outline-none bg-transparent caret-black w-[95%]"
      />
    </div>
  );
}

export default Searchbar;
