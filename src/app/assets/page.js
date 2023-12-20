"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Main from "../../layouts/Main";
import Container from "../../components/Container";
import Hero from "../../components/Hero";
import PortfolioGrid from "../../components/PortfolioGrid";
import Contact from "../../components/Contact";
import axios from "axios";
import NFTMarketPlace from "../../components/NFTMarketPlace.json";
import { ethers } from "ethers";

export default function CreateItem() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const nftAbi = NFTMarketPlace.abi;

  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [totalPrice, updateTotalPrice] = useState(null);
  const [address, updateAddress] = useState("");

  async function smartContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("signer", signer);
    const add = await signer.getAddress();
    updateAddress(add);
    const contract = new ethers.Contract(contractAddress, nftAbi, signer);
    console.log("contract", contract);
    return contract;
  }

  const loadNFTs = async () => {
    try {
      console.log("inside getmyNft");
      let sum = 0;
      const contract = await smartContract();
      const data1 = await contract.fetchMyNFTs();
      //  console.log("data",data);
      const items = await Promise.all(
        data1.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            //  console.log(tokenURI)

            // const {data: {image,name,description}} = await axios.get(tokenURI);
            const { data } = await axios.get(tokenURI);
            //  console.log("unformattedPrice",unformattedPrice);

            const { name, description, image } = data;
            const price = ethers.formatUnits(
              unformattedPrice.toString(),
              "wei"
            );
            sum = sum + Number(price);
            console.log("price", Number(price));
            // console.log({price,tokenId,seller,owner,image,name,description,tokenURI});

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
      updateTotalPrice(sum);
      setNfts(items);
      setLoaded(true);
      return items;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  if (loaded && !nfts) {
    return (
      <Main>
        <Container>
          <Hero title="No Assets Owned" />
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
  }

  return (
    <Main>
      <Container>
        <Hero title="MY NFTS" />
      </Container>
      <Container paddingY={"0 !important"}>
        <PortfolioGrid data={nfts} buttonShow={false} />
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
        <Container>
          <Contact />
        </Container>
      </Box>
    </Main>
  );
}
