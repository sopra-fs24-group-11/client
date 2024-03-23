import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function LinearIndeterminate() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant="indeterminate"
        sx={{
          height: 10,
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#1a90ff", // Color of the progress bar
          },
          "& .MuiLinearProgress-bar1Indeterminate": {
            backgroundImage:
              "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)", // Gradient color for the progress bar
          },
          "& .MuiLinearProgress-bar2Indeterminate": {
            backgroundImage:
              "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
          },
          "& .MuiLinearProgress-root": {
            backgroundColor: "#e0e0e0", // Color of the background bar
          },
        }}
      />
    </Box>
  );
}
