import React from 'react';
import { Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const LogInBtn = () => {
  return (
    <Button
      as={RouterLink}
      to="/login"
      bgColor="#BC4B51"
      outline="solid #26B24D  2px"
      color="#88B9BF"
      _hover={{
        bgColor: "#88B9BF",
        color: "#BC4B51",
        outline: "solid #BC4B51 4px",
      }}
    >
      Identificarte
    </Button>
  );
};

export default LogInBtn;

