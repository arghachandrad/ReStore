import { Backdrop, Box, LinearProgress, Typography } from "@mui/material";

interface Props {
  message?: string;
}

const Loading = ({ message }: Props) => {
  return (
    <Backdrop open={true} invisible={true}>
      <Box sx={{ width: "80%", display: "flex", flexDirection: "column" }}>
        <LinearProgress />
        {message && (
          <Typography variant="h4" sx={{ textAlign: "center", marginTop: "1rem" }}>
            {message}
          </Typography>
        )}
      </Box>
      {/* <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100vw">
        <LinearProgress color="primary" />
        <Typography variant="h4" sx={{ justifyContent: "center", position: "fixed", top: "60%" }}>
          {message}
        </Typography>
      </Box> */}
    </Backdrop>
  );
};

export default Loading;
