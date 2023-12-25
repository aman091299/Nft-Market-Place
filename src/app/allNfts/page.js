"use client"
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Main from '../../layouts/Main';
import Container from '../../components/Container';
import PortfolioGrid from '../../components/PortfolioGrid';
import Contact from '../../components/Contact';
import {ethers} from 'ethers'
import NFTMarketPlace from '../AbiNft/NFTMarketPlace.json'
import contractAddress from "../AbiNft/contractAddress"
import axios from 'axios';
const AllNfts = () => {
  const theme = useTheme();
  const [nfts, setNfts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [totalPrice,updateTotalPrice]=useState("");
  const [address,updateAddress]=useState("0x")


  const nftAbi = NFTMarketPlace.abi;

  useEffect(() => {
    loadNFTs();
  }, []);
                
 
  async function smartContract(){
    const provider=new ethers.BrowserProvider(window.ethereum);
   const signer=await provider.getSigner();
    console.log("signer",signer);
   const add=await signer.getAddress();
     updateAddress(add);
    const contract=new ethers.Contract(contractAddress,nftAbi,signer);
    console.log("contract",contract);
    return contract;
  }

    const  loadNFTs= async()=> {
     try {
      console.log("inside getmyNft")
       let sum=0;
       const contract = await smartContract();
       const data1 = await contract.getAllNFTs();
      //  console.log("data",data);
       const items = await Promise.all(
        data1.map(async({tokenId,seller,owner,price:unformattedPrice})=>{
          
            const tokenURI = await contract.tokenURI(tokenId)
            //  console.log(tokenURI)

            // const {data: {image,name,description}} = await axios.get(tokenURI);
            const {data} = await axios.get(tokenURI);
           
          
            const {name,description,image} = data
            const price = ethers.formatUnits(unformattedPrice.toString(),"wei");
             sum =sum+Number(price);
        
            
            return {
                price,
                tokenId:Number(tokenId),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
                address
            }
        })
        )
        updateTotalPrice(sum);
        setNfts(items);
        setLoaded(true);
        console.log("items",items)
       return items;
     } catch (error) {
      console.log(error)
     }
    }

    if (loaded && !nfts.length)
    return (
      <Main>
        <Box
          position={'relative'}
          marginTop={{ xs: 4, md: 6 }}
          sx={{
            backgroundColor: theme.palette.alternate.main,
          }}
        >
          <Box
            component={'svg'}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 1920 100.1"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
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
      <Container>
        <PortfolioGrid data={nfts} buttonShow={true} />
      </Container>
      <Box
        position={'relative'}
        marginTop={{ xs: 4, md: 6 }}
        sx={{
          backgroundColor: theme.palette.alternate.main,
        }}
      >
        <Box
          component={'svg'}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 1920 100.1"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
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
};

export default AllNfts;
