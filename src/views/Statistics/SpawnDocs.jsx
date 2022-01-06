import { useEffect, useState } from "react";
import { Paper, Button, Grid, Typography, Box, Zoom, Container, useMediaQuery, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import {loadAppDetails} from "../../slices/AppSlice";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import { Skeleton } from "@material-ui/lab";
import Mouse from "./mouse.png";
import Cat from "./catlogo.png";

function SpawnDocs() {

    const dispatch = useDispatch();
    const { provider, address, networkID } = useWeb3Context();

    const smallerScreen = useMediaQuery("(max-width: 650px)");
    const verySmallScreen = useMediaQuery("(max-width: 379px)");

    const miceMintedTotal = useSelector(state => {
      return state.app.miceMinted;
    });

    const catsMintedTotal = useSelector(state => {
      return state.app.catsMinted;
    });

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && "smaller"} ${verySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Paper style={{ marginBottom: "3%"}}>
        <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Gen 0 Status</Typography>
        </Paper>

        <Box>
            <Paper style={{width: "80%", margin: "0 auto"}}>
                <Typography variant="h6" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Total Gen 0 Supply: <span><Typography variant="h6" color="textPrimary" style={{textAlign: "center"}}>10,000</Typography></span></Typography>
            </Paper>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item md={6} lg={4}>
          <Paper>
            <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Mice</Typography>
            <Typography variant="body1" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>7000 Gen 0 Supply</Typography>
            <div style={{display: "flex", justifyContent: "center"}}>
              <img src={Mouse} alt="mouse trap mouse pixelated" style={{height: "60px", width: "60px"}} />
            </div>
            <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Minted: <span><Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>{miceMintedTotal ? `${miceMintedTotal}/7000` : (<Skeleton type="text" width="40px" style={{margin: "0 auto"}} />)}</Typography></span></Typography>
          </Paper>
          </Grid>
          <Grid item md={6} lg={4}>
          <Paper>
            <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Cats</Typography>
            <Typography variant="body1" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>3000 Gen 0 Supply</Typography>
            <div style={{display: "flex", justifyContent: "center"}}>
              <img src={Cat} alt="mouse trap cat pixelated" style={{height: "60px", width: "60px"}} />
            </div>
            <Typography variant="h6" color="textPrimary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Minted: <span><Typography variant="body1" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>{catsMintedTotal ? `${catsMintedTotal}/3000` : (<Skeleton type="text" width="40px" style={{margin: "0 auto"}} />)}</Typography></span></Typography>
          </Paper>
          </Grid>
        </Grid>
        
      </Container>
    </div>
  );
}

export default SpawnDocs;
