"use client";
import React from "react";
import Main from "../../layouts/Main";
import Container from "../../components/Container";
import HeroHeading from "../../components/HeroHeading";
import FeaturedNfts from "../../components/FeaturedNfts";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import NFTMarketPlace from "../AbiNft/NFTMarketPlace.json";
import axios from "axios";
import HomeGrid from "../../components/HomeGrid";
import Contact from "../../components/Contact";
import { ethers } from "ethers";
import contractAddress from "../AbiNft/contractAddress";

import SearchBar from "../../components/SearchBar";
const AllNft = () => {
  const theme = useTheme();
  const nftAbi = NFTMarketPlace.abi;
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);


  const handleSearch = (e) => {
     console.log("e",e)
    console.log("nfts2", nfts);
    const filteredNft = nfts.filter(( nft ) => {
      return nft?.description.toLowerCase().includes(e.toLowerCase());
    });
    console.log("filteredNft",filteredNft)
    if (filteredNft.length) {
      setNfts(filteredNft);
    }
  };

  useEffect(() => {
    getAllNft();
  }, []);

  async function smartContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log("provider", provider);
    const signer = await provider.getSigner();
    console.log("signer", signer);
    const add = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, nftAbi, signer);
    console.log("contract", contract);
    return contract;
  }

  const getAllNft = async () => {
    try {
      console.log("inside get all nft");
      const contract = await smartContract();
      const transaction = await contract.fetchMarketItems();
      console.log("transaction", transaction);
      const items = await Promise.all(
        transaction.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const { data } = await axios.get(tokenURI);
            console.log("data", data);
            const { name, description, image } = data;

            const price = ethers.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: Number(tokenId),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      setNfts(items);
      setLoaded(true);
      
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  if (loaded && !nfts.length)
    return (
      <Main>
        <SearchBar handleSearch={handleSearch}/>
        <Container>
          <HeroHeading />
        </Container>
        <Box
          position={"relative"}
          marginTop={{ xs: 4, md: 6 }}
          sx={{
            backgroundColor: theme.palette.alternate.main,
          }}
        >
          <Box
            component={"svg"}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1920 100.1"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transform: "translateY(-50%)",
              zIndex: 2,
              width: 1,
            }}
          >
            <path
              fill={theme.palette.alternate.main}
              d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
            ></path>
          </Box>
        </Box>
        <Container>
          <Contact />
        </Container>
      </Main>
    );
  return (
    <Main>
       <SearchBar handleSearch={handleSearch}/>
      <Container>
        <HeroHeading />
      </Container>
      <Container paddingY={3}>
        <HomeGrid data={nfts} />
      </Container>
      <Container>
        <FeaturedNfts data={nfts} />
      </Container>
      <Box
        position={"relative"}
        marginTop={{ xs: 4, md: 6 }}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      ></Box>
    </Main>
  );
};

export default AllNft;
