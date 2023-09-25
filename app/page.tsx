"use client";
import React, { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import { green, blue } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";

import { BarComponent } from "./components";
import {
  findAdjacentPrestressedConcreteBridges,
  assignBridgesToSpread,
  getChartData,
} from "./utils";
import { RawBridge } from "./models";
import data from "./data.json";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[400],
    },
    secondary: {
      main: green[300],
    },
  },
});

const InvalidSpreadMessage = () => (
  <Box
    sx={{
      display: "flex",
      height: "750px",
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "6px",
    }}
  >
    <Typography variant="h2" fontWeight={600} fontSize="18px">
      Please provide a valid value for the spread
    </Typography>
    <Typography variant="h2" fontSize="16px">
      The value of the spread must be greater than zero and less than the
      difference between the min and max year
    </Typography>
  </Box>
);

const ChartInfo = ({
  minYear,
  maxYear,
  bridgeLen,
}: {
  minYear: number;
  maxYear: number;
  bridgeLen: number;
}) => (
  <Box sx={{ width: "25%" }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        fontWeight={500}
        variant="h2"
        textAlign="right"
        fontSize="16px"
      >
        Min year
      </Typography>
      <Typography variant="h2" fontSize="16px">
        {minYear}
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography fontWeight={500} variant="h2" fontSize="16px">
        Max year
      </Typography>
      <Typography variant="h2" fontSize="16px">
        {maxYear}
      </Typography>
    </Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography fontWeight={500} variant="h2" fontSize="16px">
        Number of bridges
      </Typography>
      <Typography variant="h2" fontSize="16px">
        {bridgeLen}
      </Typography>
    </Box>
  </Box>
);

export const Home = () => {
  const [spread, setSpread] = useState<number>(5);
  const [dataset, setDataset] = useState<string>("2021 NBI Data");

  const {
    minYear,
    maxYear,
    bridges: validBridges,
    bridgeYearMap,
  } = useMemo(
    () => findAdjacentPrestressedConcreteBridges(data as RawBridge[]),
    [],
  );

  const bridgeRangeMap: Map<number, RawBridge[]> = useMemo(
    () => assignBridgesToSpread(minYear, maxYear, spread, bridgeYearMap),
    [spread, minYear, maxYear, bridgeYearMap],
  );

  const { labels, values3, values4, values5, values6, values7 } = useMemo(
    () => getChartData(maxYear, spread, bridgeRangeMap),
    [maxYear, spread, bridgeRangeMap],
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 8,
          height: "100vh",
          backgroundColor: "#f7f7f7",
        }}
      >
        <Card
          raised
          sx={{
            width: "65%",
            borderRadius: "10px",
            padding: 2,
          }}
        >
          <Typography fontSize="18px" textAlign="left" variant="h2">
            MassDot Adjacent Prestressed Concrete Beam Bridges By Year Built and
            % Condition
          </Typography>
          <div
            style={{
              borderBottom: "1px solid #f5f6f7",
              width: "100%",
            }}
          />
          <Box
            sx={{
              display: "flex",
              padding: "20px 0",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "40%",
              }}
            >
              <FormControl>
                <InputLabel id="dataset-nbi-label">Dataset</InputLabel>
                <Select
                  labelId="dataset-nbi-label"
                  id="dataset-nbi-id"
                  value={dataset}
                  disabled
                  label="Dataset"
                  onChange={(e: SelectChangeEvent) => {
                    setDataset(e.target.value);
                  }}
                >
                  <MenuItem value="2021 NBI Data">2021 NBI Data</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Year spread"
                id="year-spread"
                helperText="Provide a value for the year grouping (5 year spread: 2010-2014, 2015-2019, etc)"
                onChange={(e) => {
                  const num = Number(e.target.value);
                  if (!Number.isNaN(num)) setSpread(num);
                }}
                value={spread}
                size="small"
              />
            </Box>
            <ChartInfo
              bridgeLen={validBridges.length}
              minYear={minYear}
              maxYear={maxYear}
            />
          </Box>
          {spread === 0 || spread > maxYear - minYear ? (
            <InvalidSpreadMessage />
          ) : (
            <BarComponent
              labels={labels}
              values3={values3}
              values4={values4}
              values5={values5}
              values6={values6}
              values7={values7}
            />
          )}
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
