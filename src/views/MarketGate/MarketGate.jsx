import React from "react";
import { useHistory } from "react-router-dom";

import {
    Box,
    Button,
    Container,
    Paper,
    useMediaQuery,
    Modal,
    FormControl,
    TextField,
    Divider,
    Grid,
    Typography,
} from "@material-ui/core";

import "./MarketGate.css";

import CheezPass from "../../assets/images/cheezpass.gif";
import Both from "../../assets/images/both.png";

const MarketGate = () => {

    const smallerScreen = useMediaQuery("(max-width: 650px)");
    const verySmallScreen = useMediaQuery("(max-width: 379px)");

    let history = useHistory();

    return (
        <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}>
            <Paper style={{ marginBottom: "3%"}}>
                <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Marketplace</Typography>
            </Paper>
            <Box style={{display: "flex", flexDirection: verySmallScreen ? "column" : smallerScreen ? "column" : "row", justifyContent: "space-evenly", marginTop: "10%"}}>
                <Paper className="hoverChoose" style={{width: verySmallScreen ? "85%" : smallerScreen ? "85%" : "45%", background: "transparent", paddingBottom: "2%", margin: smallerScreen ? "0 auto" : verySmallScreen ? "0 auto" : ""}} onClick={() => {history.push('/marketplace')}}>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <img src={Both} alt="season 1 examples" style={{height: smallerScreen ? "100px" : "200px", width: smallerScreen ? "100px" : "200px"}} />
                    </Box>
                    <Divider />
                    <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingTop: "3%", marginTop: "1%",}}>Season One</Typography>
                </Paper>
                <Paper className="hoverChoose" style={{width: verySmallScreen ? "85%" : smallerScreen ? "85%" : "45%", background: "transparent", paddingBottom: "2%", margin: smallerScreen ? "0 auto" : verySmallScreen ? "0 auto" : "", marginTop: smallerScreen ? "3%" : ''}} onClick={() => {history.push('/cheezpass')}}>
                    <Box style={{display: "flex", justifyContent: "center"}}>
                        <img src={CheezPass} alt="cheez pass gif" style={{height: smallerScreen ? "100px" : "200px", width: smallerScreen ? "100px" : "200px"}} />
                    </Box>
                    <Divider />
                    <Typography variant="h4" color="textSecondary" style={{textAlign: "center", paddingTop: "3%", marginTop: "1%",}}>Cheez Pass</Typography>
                </Paper>
            </Box>
        </Container>
    )
}

export default MarketGate;