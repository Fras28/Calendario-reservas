import React, { useEffect } from "react";
import { Parallax } from "react-parallax";
import { Box, Button, Heading, Text, useMediaQuery } from "@chakra-ui/react";
import { BsPersonPlusFill } from "react-icons/bs";
import { Link as ScrollLink } from "react-scroll";
import bgImg from "../assets/Padelhall.jpeg";
import Prestadores from "../Prestadores";
import { useSelector, useDispatch } from "react-redux";
import { fetchComercio } from "../redux/slice";


const HeroSection = () => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  const role = useSelector(state => state?.reservas?.role);
  const comercio = useSelector(state => state?.reservas?.comercio);

  useEffect(() => {
    dispatch(fetchComercio());
  }, [dispatch]);

  const logoUrl = comercio?.data?.attributes?.logo?.data?.attributes?.url;
  const comercioName = comercio?.data?.attributes?.nombre;
  const API_URL = process.env.REACT_APP_API_URL;

  const content = (
    <Box
      className="boxHero"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="rgba(255, 255, 255, 0.25)"
      minH="70vh"
    >
      <Box textAlign="center" color="white" position="relative">
        <Heading
          as="h1"
          size="2xl"
          mb="4"
          sx={{
            WebkitTextStroke: "2px #26B24D ",
            fontFamily: "Berkshire Swash, serif",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {logoUrl && (
            <img
              src={`${API_URL}${logoUrl}`}
              alt="Logo"
              width="30%"
              style={{ backgroundColor: "#000000b5", borderRadius: "50%" }}
              className="buttonHero"
            />
          )}
        </Heading>
        <Text fontSize="32px" mb="6" className="titMai">
          {comercioName || 'Cargando...'}
        </Text>
        <ScrollLink to="prestadores" smooth={true} duration={500}>
          <Button
            bgColor="#BC4B51"
            border="solid #26B24D  2px"
            color="#88B9BF"
            _hover={{
              bgColor: "#88B9BF",
              color: "#BC4B51",
              border: "solid #BC4B51 4px",
            }}
            size="lg"
            leftIcon={<BsPersonPlusFill />}
          >
            Hacer Reserva
          </Button>
        </ScrollLink>
        <Text fontSize="l" mb="6">
          {comercio?.data?.attributes?.direccion}
        </Text>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Box
          className="mobile-container"
          bgImage={`url(${bgImg})`}
          bgSize="cover"
          bgPos="center"
          minH="70vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {content}
        </Box>
      ) : (
        <Parallax
          bgImage={bgImg}
          strength={500}
          bgImageStyle={{
            left: "50%",
            transform: "translate3d(-50%, -53.1804px, 0px)",
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            minHeight: "28vh",
            height: "auto",
            width: "1920px",
            filter: "none",
          }}
          className="parallax-container"
        >
          {content}
        </Parallax>
      )}
      <Box mt={10} id="prestadores">
        <Prestadores />
      </Box>
    </>
  );
};

export default HeroSection;