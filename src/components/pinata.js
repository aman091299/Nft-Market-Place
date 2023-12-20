import axios from "axios";
import FormData from 'form-data'
 // Single File Upload
const JWT ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMmZlYzBlMi02NzQzLTQyOTctODAzYS01MWFiYjAxN2NkNTYiLCJlbWFpbCI6ImFtYW4wOTEyOTlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImQzOTAyNTAxMDMxZjBjOWZmYzNiIiwic2NvcGVkS2V5U2VjcmV0IjoiNjc1OGM4ODQ3M2VlNjU3MzNlNzM5NGRlYzljN2Q4NjkyMjA5MTY4NjQyZGI5N2I4OTE5ZTc3MzE1MzZmYjMzOCIsImlhdCI6MTcwMDQ4MTU5N30.kGGcYGoiB56ibhWiLSq911uRsRNTImmT-z_zdlxDnbo'
const API_Key = "d3902501031f0c9ffc3b"
const API_Secret = "6758c88473ee65733e7394dec9c7d8692209168642db97b8919e7731536fb338"

export const UploadFileToIPFS =async(file)=> {
const formData = new FormData();

formData.append('file', file)

const pinataMetadata = JSON.stringify({
  name: 'File name',
});
formData.append('pinataMetadata', pinataMetadata);

const pinataOptions = JSON.stringify({
  cidVersion: 0,
})
formData.append('pinataOptions', pinataOptions);

try{
  const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
    maxBodyLength: "Infinity",
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      Authorization: `Bearer ${JWT}`,
      pinata_api_key: API_Key,
      pinata_secret_api_key: API_Secret,
    }
  });

  console.log("response",response.data);
  return {
     success:true,
     pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
  }
} catch (error) {
  console.log(error);
}
}

export const pinJSONToIPFS=async(data)=>{
   
   
  try{
    const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JWT}`,
        pinata_api_key: API_Key,
        pinata_secret_api_key: API_Secret,
      }
    });
    console.log("response",response.data);
  return {
     success:true,
     pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
  }
  } catch (error) {
    console.log(error);
  }

}


