import React, { useState } from "react";
import { Box, Flex, Text, VStack, Image, Button } from "@chakra-ui/react";
import diasHorarios from "./diasHorarios";

const PrestadorDetail = ({ prestador }) => {
  const [selectedDia, setSelectedDia] = useState("");
  const [selectedHora, setSelectedHora] = useState("");

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Flex direction={{ base: "column", md: "row" }} align="center">
        <Box mr={{ md: 6 }}>
          <Image
            borderRadius="full"
            boxSize="150px"
            src={prestador.attributes.avatar.data.attributes.url}
            alt={prestador.attributes.nombre}
          />
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            {prestador.attributes.nombre}
          </Text>
          <Text>{prestador.attributes.Servicio}</Text>
        </Box>
      </Flex>
      <VStack align="start" mt={4}>
        <Text fontSize="lg" fontWeight="bold">
          Seleccione Día y Horario:
        </Text>
        <diasHorarios
          prestador={prestador}
          setSelectedDia={setSelectedDia}
          setSelectedHora={setSelectedHora}
        />
        <Button
          bgColor="#BC4B51"
          outline="solid #26B24D  2px"
          color="#88B9BF"
          _hover={{
            bgColor: "#88B9BF",
            color: "#BC4B51",
            outline: "solid #BC4B51 4px",
          }}
          mt={4}
          onClick={() =>
            console.log(
              `Día seleccionado: ${selectedDia}, Horario seleccionado: ${selectedHora}`
            )
          }
        >
          Reservar
        </Button>
      </VStack>
    </Box>
  );
};

export default PrestadorDetail;
