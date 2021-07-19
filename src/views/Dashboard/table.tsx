import React from "react";
import { CellProps, Column, Renderer, useRowSelect } from "react-table";
import {
  BasicTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { BalanceView } from "../common/BalanceView";
import { DepositAPYView, BorrowAPRView } from "../common/RatesView";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Flex, Switch } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";
import ColoredText from "../../components/ColoredText";
import { AssetData } from ".";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { useHistory } from "react-router-dom";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { BigNumber } from "ethers";
import { ProtocolReserveData } from "../../queries/protocolReserveData";
import { fontSizes } from "../../utils/constants";

export enum DashboardTableType {
  Deposit = "Deposit",
  Borrow = "Borrow",
}

const CollateralView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveConfiguration } =
    useProtocolReserveConfiguration(tokenAddress);
  const isCollateralized = reserveConfiguration?.usageAsCollateralEnabled;

  return React.useMemo(() => {
    return (
      <Switch size="sm" colorScheme="gray" isDisabled={isCollateralized} />
    );
  }, [isCollateralized]);
};

export const DashboardTable: React.FC<{
  mode: DashboardTableType;
  assets: AssetData[];
}> = ({ mode, assets }) => {
  const history = useHistory();
  const onActionClicked = React.useCallback(
    (route: String, asset: Readonly<ReserveTokenDefinition>) => {
      if (route === "Deposit-Borrow") {
        if (mode === DashboardTableType.Deposit) {
          history.push(`/deposit/${asset.symbol}`);
        } else if (mode === DashboardTableType.Borrow) {
          history.push(`/borrow/${asset.symbol}`);
        }
      } else if (route === "Withdraw-Repay") {
        if (mode === DashboardTableType.Deposit) {
          history.push(`/repay/${asset.symbol}`);
        } else if (mode === DashboardTableType.Borrow) {
          history.push(`/withdraw/${asset.symbol}`);
        }
      }
    },
    [mode, history]
  );

  const columns: Column<AssetData>[] = React.useMemo(
    () => [
      {
        Header:
          mode === DashboardTableType.Borrow ? "My Borrows" : "My Deposits",
        accessor: row => row.symbol, // We use row.original instead of just record here so we can sort by symbol
        Cell: (({ value, row }) => (
          <Flex alignItems={"center"}>
            <Box>
              <TokenIcon symbol={value} />
            </Box>
            <Box w="1rem"></Box>
            <Box>
              <Text>{value}</Text>
            </Box>
          </Flex>
        )) as Renderer<CellProps<AssetData, string>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "Borrowed" : "Deposited",
        accessor: row => row.balance,
        Cell: (({ value }) => <BalanceView balanceBN={value} />) as Renderer<
          CellProps<AssetData, BigNumber>
        >,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "APR" : "APY",
<<<<<<< HEAD
        accessor: row =>
          row.backingReserve
            ? row.backingReserve.tokenAddress
            : row.tokenAddress,
        Cell: (({ value }) =>
          mode === DashboardTableType.Borrow ? (
            <BorrowAPRView tokenAddress={value} isStable={false} />
          ) : (
            <DepositAPYView tokenAddress={value} />
          )) as Renderer<CellProps<AssetData, string>>,
      },
=======
        accessor: row => row.tokenAddress,  
        Cell: (({ value }) => (
          /* There's a difference between the deposit APY and the borrow APR.
             Lending rates are obviously higher than borrowing rates */
          <DepositAPYView tokenAddress={value} />
        )) as Renderer<CellProps<AssetData, string>>,
      }, 
>>>>>>> dev
      {
        Header: mode === DashboardTableType.Borrow ? " " : "Collateral",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <Box
            d="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {mode === DashboardTableType.Deposit && (
              <>
                <Text fontWeight="bold">{"userAssetCollateral! "}</Text>
                <CollateralView tokenAddress={value} />{" "}
                {/* drop the collateralView make this button toggle directly a mutation call */}
              </>
            )}
          </Box>
        )) as Renderer<CellProps<AssetData, string>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "Actions" : "Actions",
        accessor: row => row.tokenAddress,
<<<<<<< HEAD
        Cell: (({ row }) => (
          <Box
            d="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              bg="secondary.900"
              _hover={{ bg: "primary.50" }}
              onClick={() =>
                onActionClicked("Deposit-Borrow", {
                  symbol:
                    row.original.backingReserve?.symbol ?? row.original.symbol,
                  tokenAddress:
                    row.original.backingReserve?.tokenAddress ??
                    row.original.tokenAddress,
                })
              }
            >
              <ColoredText fontSize="1rem" fontWeight="400">
                {mode === DashboardTableType.Borrow ? "Borrow" : "Deposit"}
              </ColoredText>
            </Button>
            <Button
              borderColor="primary.50"
              color="primary.50"
              fontWeight="400"
              variant="outline"
              _hover={{ bg: "white" }}
              onClick={() =>
                onActionClicked("Withdraw-Repay", {
                  symbol:
                    row.original.backingReserve?.symbol ?? row.original.symbol,
                  tokenAddress:
                    row.original.backingReserve?.tokenAddress ??
                    row.original.tokenAddress,
                })
              }
            >
              {mode === DashboardTableType.Borrow ? "Repay" : "Withdraw"}
            </Button>
          </Box>
        )) as Renderer<CellProps<AssetData, string>>,
=======
        Cell: (({ row }) =>
          (
            <Box
              d="flex"
              flexDir="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                fontSize={{base:fontSizes.md, md:fontSizes.lg }}
                bg="secondary.900"
                _hover={{ bg: "primary.50" }}
                mr="1rem"
                onClick={() =>
                  onActionClicked("Deposit-Borrow", {
                    symbol:
                      row.original.backingReserve?.symbol ??
                      row.original.symbol,
                    tokenAddress:
                      row.original.backingReserve?.tokenAddress ??
                      row.original.tokenAddress,
                  })
                }
              >
                <ColoredText fontWeight="400">
                  {mode === DashboardTableType.Borrow ? "Borrow" : "Deposit"}
                </ColoredText>
              </Button>
              <Button
                fontSize={{base:fontSizes.sm, md:fontSizes.md }}
                borderColor="primary.50"
                color="primary.50"
                fontWeight="400"
                variant="outline"
                _hover={{ bg: "white" }}
                onClick={() =>
                  onActionClicked("Withdraw-Repay", {
                    symbol:
                      row.original.backingReserve?.symbol ??
                      row.original.symbol,
                    tokenAddress:
                      row.original.backingReserve?.tokenAddress ??
                      row.original.tokenAddress,
                  })
                }
              >
                {mode === DashboardTableType.Borrow ? "Repay" : "Withdraw"}
              </Button>
            </Box>
          )) as Renderer<CellProps<AssetData, string>>,
>>>>>>> dev
      },
    ],
    [mode, onActionClicked]
  );

  const renderer = React.useMemo<TableRenderer<AssetData>>(
    () => table =>
      (
        <BasicTableRenderer
          table={table}
          tableProps={{
            style: {
              borderSpacing: "0 1em",
              borderCollapse: "separate",
              width: "100%",
            },
          }}
          headProps={{
            fontSize: "12px",
            fontFamily: "inherit",
            color: "white",
            border: "none",
          }}
          rowProps={{
            // rounded: { md: "lg" }, // "table-row" display mode can't do rounded corners
            bg: "primary.900",
            color: "white",
          }}
          cellProps={{
            borderBottom: "none",
            border: "0px solid",
            maxWidth:"10rem",
            _first: { borderLeftRadius: "10px" },
            _last: { borderRightRadius: "10px" },
          }}
        />
      ),
    []
  );

  return (
    <SortedHtmlTable columns={columns} data={assets}>
      {renderer}
    </SortedHtmlTable>
  );
};
