import Container from "../../components/Container";
import Hero from "../../components/Hero";
import Form from "../../components/Form";
import Contact from "../../components/Contact";
import Main from "../../layouts/Main";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

export default function CreateItem() {
  return (
    <>
      <Main>
        <Container>
          <Hero title="A platform to create and trade NFTs." />
        </Container>
        <Container paddingY={"0 !important"}>
          <Form />
        </Container>
        <Box position={"relative"} marginTop={{ xs: 4, md: 6 }} sx={{}}>
          <Box>
            <path d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"></path>
          </Box>
          <Container>
            <Contact />
          </Container>
        </Box>
      </Main>
    </>
  );
}
