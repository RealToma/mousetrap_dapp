import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ethers } from "ethers";

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
import { Skeleton } from "@material-ui/lab";

import CloseIcon from "./close.png";
import CheezPassGif from "./cheezpass.gif";
import { useWeb3Context } from "src/hooks/web3Context";
import Merkle from "./merkle.json";

//account details
import { loadAccountDetails, getBalances } from "../../slices/AccountSlice";
import { useDispatch, useSelector } from "react-redux";

import { mintNFT, changeApproval } from "../../slices/PassSlice";
import { mintReservedNFT} from "../../slices/ReservedPassSlice";

import "./MarketGate.css";

const CheezPass = () => {

    const dispatch = useDispatch();

    const { provider, address, connected, connect, chainID } = useWeb3Context();
    const smallerScreen = useMediaQuery("(max-width: 650px)");
    const verySmallScreen = useMediaQuery("(max-width: 379px)");
    const [ amount, setAmount ] = useState(null);
    const [ whitelist, setWhitelist ] = useState({});
    const accountDetails = useSelector(state => state.account)
    const [approvalStatus, setApprovalStatus] = useState(false);
    const [reservedApprovalStatus, setReservedApprovalStatus] = useState(false);

    useEffect(() => {
        dispatch(loadAccountDetails({ networkID: chainID, address, provider: provider }))
        if(approvalStatus === false) {
          if(accountDetails.pass) {
            setApprovalStatus(accountDetails.pass.mintPassAllowance.gte(ethers.utils.parseUnits("1", 9)))
          }
        }
      }, [loadAccountDetails, accountDetails.pass, approvalStatus, address])

    let history = useHistory();


    const claimedMps = useSelector(state => {
        return state.account.pass && state.account.pass.claimedMps;
    });

    const claimedReserves = useSelector(state => {
      return state.account.pass && state.account.pass.claimedReserves;
  });


    const totalSupply = useSelector(state => {
      return state.app && state.app.passTotalSupply;
    });

    const passAvailable = useSelector(state => {
      return state.app && state.app.passAvailable;
    });



    const onSeekApproval = async => {
        dispatch(changeApproval({ address, provider, networkID: chainID }));
    };

    const onMintReservedNFT = async => {
        dispatch(mintReservedNFT({ proof: whitelist.proof, index: whitelist.index, provider, networkID: chainID }));
    };  

    const onMintNFT = async => {
        dispatch(mintNFT({ provider, networkID: chainID }));
    };  

    useEffect(() => {
        let data = Merkle.claims
        if(address in data) {
            setWhitelist(data[address])
        }
    }, [Merkle, address])

    return (
        <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? "0" : "3.3rem",
          paddingRight: smallerScreen || verySmallScreen ? "0" : "3.3rem",
        }}>
            <Paper style={{ marginBottom: "3%"}}>
                <Typography variant="h2" color="textSecondary" style={{textAlign: "center", paddingTop: "2%", paddingBottom: "2%", marginTop: "1%", marginBottom: "2%"}}>Cheez Pass</Typography>
            </Paper>
            <Paper style={{border: "1px solid #ebc50c", background: "transparent", margin: "0 auto", marginTop: "2%", width: "80%"}}>
                <Typography variant="h3" color="textPrimary" style={{textAlign: "center", marginBottom: "1%", marginTop: "1%"}}>Mint a Pass</Typography>
            </Paper>
            <Typography variant="h6" color="textPrimary" style={{textAlign: "center", marginBottom: smallerScreen ? "3%" : verySmallScreen ? "4%" : "1%", marginTop: "1%"}}>Gen 0 minters have ONE Cheez Pass reserved until January 4<sup>th</sup> @ 8:00pm EST</Typography>
            <Typography variant="body1" color="textPrimary" style={{textAlign: "center", margin: "0 auto", marginBottom: smallerScreen ? "4%" : verySmallScreen ? "4%" : "1%", width: "100%"}}>Each Cheez Pass entitles the holder to 1 Gen0 Cow NFT</Typography>
            <Typography variant="h4" color="textPrimary" style={{textAlign: "center", marginTop: "1%"}}>Price: 5 🧀</Typography>
            <Box style={{width: smallerScreen ? "80%" : verySmallScreen ? "80%" : "40%", margin: "0 auto", marginTop: "1%"}}>
            <Paper className="hover" style={{display: "flex", flexDirection: "column", justifyContent: "center", background: "transparent", border: "1px solid #3ce8a6"}}>
            <div style={{display: "flex", justifyContent: "center"}}>
                <img src={CheezPassGif} alt="cheez pass gif" style={{height: "200px", width: "200px"}} />
            </div>
            <div style={{width: "80%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
                <Button
                variant="outlined"
                color="primary"
                style={{marginLeft: "25%", marginBottom: "5%", marginTop: "5%"}}
                disabled
              >
                Sold Out
              </Button>
            </div>
            {passAvailable && totalSupply ? (
                <>
                <Typography variant="body1" color="textPrimary" style={{textAlign: "center", marginBottom: "1%", marginTop: "1%"}}>Left in Public Sale: <span style={{color: "#ebc50c"}}>{passAvailable}</span></Typography>
                <Typography variant="h6" color="textPrimary" style={{textAlign: "center", marginBottom: "1%", marginTop: "1%"}}>Total Minted: <span style={{color: "#ebc50c"}}>{totalSupply}/1000</span></Typography>
                </>
            ) : (
                <></>
            )}
          </Paper>
          <Typography variant="body2" style={{textAlign: "center", marginBottom: "1%", marginTop: "1%", color: "#fc6876"}}>Total left in public sale is subject to change when reservations expire.</Typography>

            </Box>
        </Container>
    )
}

export default CheezPass;