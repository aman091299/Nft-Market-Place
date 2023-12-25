import React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({handleSearch}) => {
  const [searchInput, setSearchInput] = useState("");
 
  const search=()=>{
    console.log("search",searchInput);
    handleSearch(searchInput);
  }
 

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <input
        type="search"
        placeholder="Type Your Nft"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Typography component="div" sx={{ position: "absolute", left: 154 }}>
        <IoSearch onClick={search} />
      </Typography>
    </Box>
  );
};

export default SearchBar;
