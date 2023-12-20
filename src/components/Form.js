"use client" // This is a client component 👈🏽
import DialogBox from "./DialogBox";
import React, { useState, useRef } from "react";
import { UploadFileToIPFS, pinJSONToIPFS } from "./pinata";
import { useFormik } from "formik";
import * as yup from "yup";
import { ethers } from "ethers";
import {
  Box,
  Grid,
  TextField,
  Typography,
  IconButton,
  Collapse,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

import NFTMarketPlace from "./NFTMarketPlace.json";

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name too short")
    .max(50, "Name too long")
    .required("Please specify the name"),
  description: yup
    .string()
    .trim()
    .max(1000, "Should be less than 1000 chars")
    .required("Please write description"),
  price: yup
    .number()
    .min(0, "Price should be minimum 0")
    .required("Please specify NFT price"),
});

const Form = () => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const nftAbi = NFTMarketPlace.abi;

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      listNft(values);
    },
  });

  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);
  const [loading, setLoading] = React.useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [hash, setHash] = useState("");
  const fileInputRef = useRef(null);

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const response = await UploadFileToIPFS(file);

      if (response.success) {
        setFileUrl(response.pinataURL);
        console.log(response.pinataURL);
        setOpen(true);
        setAlertOpen(false);
      }
    } catch (error) {
      console.log("Error uploading file: ", error);
      setLoading(false);
      setOpen(false);
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description, price } = formik.values;
    if (!name || !description || !price || !fileUrl){
      return
    } ;
    const nftJSON = { name, description, price, image: fileUrl };
    try {
      const response = await pinJSONToIPFS(nftJSON);

      if (response.success === true) {
        return response.pinataURL;
      }
      else{
        return;
      }
    } catch (error) {
      console.log("error uploading Json metadata", error);
    }
  }

  async function smartContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, nftAbi, signer);
    return contract;
  }

  async function listNft() {
    console.log("inside listNft");
    try {
      console.log("fileUrl",fileUrl)
      const metadataURL = await uploadMetadataToIPFS();
      if (!metadataURL){
        alert(" Please choose a file.");
        setLoading(false);
        return;
      } 

      const contract = await smartContract();

      let listingPrice = await contract.getListingPrice();
      const price = ethers.parseUnits(formik.values.price, "ether");

      let transaction = await contract.createToken(
        metadataURL,
        formik.values.price,
        { value: listingPrice }
      );
      const createToken = await transaction.wait();
      setHash(transaction.hash);
      setDialogBoxOpen(true);
      console.log("create token", createToken);
      alert("Successfully listed your NFT!");
    } catch (error) {
      console.log(error);
      alert("Error in creating NFT! Please try again.");
      setLoading(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear the file input
    }
    setAlertOpen(false);
    formik.resetForm();
    console.log(fileUrl);
    setLoading(false);
    if (!fileUrl) return setAlertOpen(true);
  }
  return (
    <Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"subtitle2"}
              sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}
              fontWeight={700}
            >
              <AttachFileIcon fontSize="medium" />
              Upload file *
            </Typography>
            <input
              type="file"
              name={"file"}
              onChange={onChange}
              ref={fileInputRef}
            />
            <Collapse in={open}>
              <Alert
                severity="success"
                sx={{ mt: 1 }}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                File uploaded successfully!
              </Alert>
            </Collapse>
            <Box sx={{ width: "100%" }}>
              <Collapse in={alertOpen}>
                <Alert
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlertOpen(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  Please upload a file!
                </Alert>
              </Collapse>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"subtitle2"}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              NFT Name
            </Typography>
            <TextField
              label="Name of your NFT *"
              variant="outlined"
              name={"name"}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.name}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant={"subtitle2"}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Description
            </Typography>
            <TextField
              label="Description *"
              variant="outlined"
              name={"description"}
              multiline
              rows={3}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.description}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography
              variant={"subtitle2"}
              sx={{ marginBottom: 2 }}
              fontWeight={700}
            >
              Price
            </Typography>
            <TextField
              label=" Min 1 ether *"
              variant="outlined"
              name={"price"}
              fullWidth
              onChange={formik.handleChange}
              value={formik.values?.price}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
          </Grid>

          <Grid item container xs={12}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "stretched", sm: "center" }}
              justifyContent={"space-between"}
              width={1}
              margin={"0 auto"}
            >
              <LoadingButton
                endIcon={<SendIcon />}
                size={"large"}
                variant={"contained"}
                type={"submit"}
                loading={loading}
                loadingPosition={"end"}
                     >
                Create
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
      <DialogBox
        open={dialogBoxOpen}
        onClose={() => setDialogBoxOpen(false)}
        title={"Yeee!"}
        message={`NFT created successfully with hash: ${hash}`}
      />
    </Box>
  );
};

export default Form;
