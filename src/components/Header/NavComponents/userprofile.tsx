import React, { useMemo } from "react";
import {
  Text,
  Center,
  Badge,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { bigNumberToString } from "../../../utils/fixedPoint";
import { useAmountAvailableToStake } from "../../../queries/amountAvailableToStake";
import { useAppWeb3 } from "../../../hooks/appWeb3";

export const UserProfile: React.FC<{}> = () => {
  // Light/Dark button functions
  // const { colorMode, toggleColorMode } = useColorMode();

  // Address button functions
  const address: string | undefined = useAppWeb3().account ?? undefined;
  const addressPretty = useMemo(
    () =>
      address
        ? `${address.substring(0, 4)}...${address.substring(
            address.length - 4,
            address.length
          )}`
        : "Not Connected",
    [address]
  );

  // Agve button functions
  const { data: agaveBalance } = useAmountAvailableToStake(address);
  const userBal = agaveBalance ? bigNumberToString(agaveBalance, 3) : "0";
  let chainId;

  switch(useAppWeb3().chainId){
    case 4:
      chainId = "Rinkeby";
      break;
    case 100:
      chainId = "xDai";
      break;
  }

  return (
    <>
      {/* NIGHTMODE 
      <Center
        width={{ base: "4rem", md: "3rem" }}
        height={{ base: "4rem", md: "3rem" }}
        rounded="lg"
        bg={mode({ base: "primary.800", md: "primary.500" }, "primary.500")}
        cursor="pointer"
        onClick={toggleColorMode}
      >
        <Image
          src={colorMode === "dark" ? darkMoon : lightMoon}
          alt="theme-mode"
        />
        
    </Center>*/}
      <Center
        minWidth="10rem"
        height={{ base: "4rem", md: "3rem" }}
        fontSize={{ base: "4xl", md: "2xl" }}
        mx="1.5rem"
        textTransform="uppercase"
        color="white"
        bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
        rounded="lg"
        px="5px"
        mr="2px"
      >
        <Text mr="5px">{userBal}</Text>
        <Text fontWeight="400">AGVE</Text>
      </Center>

      <Center
        minWidth="14rem"
        height={{ base: "4rem", md: "3rem" }}
        fontSize={{ base: "4xl", md: "2xl" }}
        mx="1.5rem"
        px="1.5rem"
        color="white"
        bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
        rounded="lg"
      >
        {useAppWeb3().chainId ? <Text fontWeight="400">Chain: {chainId}</Text> : <Text fontWeight="400">Invalid Chain</Text>}
        
      </Center>
      
      <Center
        background={mode(
          { base: "secondary.800", md: "primary.500" },
          "primary.500"
        )}
        rounded="lg"
        minWidth="14rem"
        height={{ base: "4rem", md: "3rem" }}
        color="white"
        p="10px"
      >
        <Badge
          bg="yellow"
          rounded="full"
          width={{ base: "1.3rem", md: "1rem" }}
          height={{ base: "1.3rem", md: "1rem" }}
          mr="5px"
        />
        <Text fontSize={{ base: "4xl", md: "2xl" }}>{addressPretty}</Text>
      </Center>
    </>
  );
};
