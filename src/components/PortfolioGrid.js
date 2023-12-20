import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import LinkIcon from '@mui/icons-material/Link';
import Link from '@mui/material/Link';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import {ethers} from "ethers";
import NFTMarketPlace from "./NFTMarketPlace.json"

const PortfolioGrid = ({ data = [], buttonShow }) => {
  const theme = useTheme();
 
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const nftAbi = NFTMarketPlace.abi;

  async function smartContract(){
    const provider=new ethers.BrowserProvider(window.ethereum);
   const signer=await provider.getSigner();
    console.log("signer",signer);
   const add=await signer.getAddress();
  
    const contract=new ethers.Contract(contractAddress,nftAbi,signer);
    console.log("contract",contract);
    return contract;
  }

  async function buyNft(item){
    try { 
    console.log("inside buy nft")
    const  contract  =await smartContract();
    //converting into ether pareseUnits
    const salePrice = ethers.parseUnits(item.price, 'wei')
     console.log("salePrice")
    const transaction=await contract.createMarketSale(item.tokenId,{value:salePrice});
      const buying= await transaction.wait();
    console.log("transaction",transaction);
    console.log("buying",buying)
    
    } catch (error) {
      console.log(error)
    }
     
     }

  return (
    <Box>
      <Grid container spacing={4}>
        {data.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box display={'block'} width={1} height={1}>
              <Box
                key={i}
                component={Card}
                width={1}
                height={1}
                display={'flex'}
                flexDirection={'column'}
              >
                <CardMedia
                  title={item.name}
                  image={item.image}
                  sx={{
                    position: 'relative',
                    height: { xs: 240, sm: 340, md: 280 },
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    position={'absolute'}
                    bottom={0}
                    padding={2}
                    width={1}
                  >
                    <Box
                      padding={1}
                      bgcolor={'background.paper'}
                      boxShadow={1}
                      borderRadius={2}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.price} ETH
                      </Typography>
                    </Box>
                    <Box
                      padding={1}
                      bgcolor={'background.paper'}
                      boxShadow={1}
                      borderRadius={2}
                    >
                      <Box
                        component={'svg'}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        width={16}
                        height={16}
                        color={'primary.main'}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </Box>
                    </Box>
                  </Box>
                </CardMedia>
                <CardContent>
                  <Typography
                    variant={'h6'}
                    align={'left'}
                    sx={{ fontWeight: 700 }}
                  >
                    {item.name}
                  </Typography>
                  <Box display={'flex'} alignItems={'center'} marginY={2}>
                    <Typography variant={'subtitle2'} color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box
                      component={'svg'}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width={16}
                      height={16}
                      marginRight={1}
                    >
                      <LinkIcon />
                    </Box>
                    <Typography variant={'subtitle2'} color="text.secondary">
                      <Link href={item.address} underline="none">
                        Link to NFT
                      </Link>
                    </Typography>
                  </Box>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    {buttonShow && (
                      <Button
                        onClick={() => buyNft(item)}
                        startIcon={
                          <Box
                            component={'svg'}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            width={24}
                            height={24}
                          >
                            <ShoppingBagIcon />
                          </Box>
                        }
                      >
                        Buy
                      </Button>
                    )}
                  </CardActions>
                </CardContent>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

PortfolioGrid.propTypes = {
  data: PropTypes.array,
  buttonShow: PropTypes.bool,
};

export default PortfolioGrid;