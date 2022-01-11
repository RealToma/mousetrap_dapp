// import { useCallback, useState } from "react";
// import { NavLink } from "react-router-dom";
// import Social from "./Social";
// import externalUrls from "./externalUrls";
// import { trim, shorten } from "../../helpers";
// import { useAddress, useWeb3Context } from "src/hooks/web3Context";
// import useBonds from "../../hooks/Bonds";
// import { Paper, Link, Box, Typography, SvgIcon } from "@material-ui/core";
// import { Skeleton } from "@material-ui/lab";
// import "./sidebar.scss";
// import CheeseIcon from "./cheeseicon.png";
// import BondIcon from "./bondicon.png";
// import HomeIcon from "./homeicon.png";
// import BeakerIcon from "./beakericon.png";
// import StatusIcon from "./status.png";
// import UnlockIcon from "./unlock.png";
// import ShoppingIcon from "./shopping-cart-icon.png";
// import Juggling from "./juggling.png";
// import Factory from "./factory.png";
// import Spinning from "./spinningLogo.gif"
// import BridgeIcon from "./bridge.png";
// import ControllerIcon from "./joystick.png";

// function NavContent() {
//   const [isActive] = useState();
//   const address = useAddress();
//   const { bonds } = useBonds();
//   const { chainID } = useWeb3Context();

//   const checkPage = useCallback((match, location, page) => {
//     const currentPath = location.pathname.replace("/", "");
//     if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
//       return true;
//     }
//     if (currentPath.indexOf("ageing") >= 0 && page === "ageing") {
//       return true;
//     }
//     if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
//       return true;
//     }
//     if ((currentPath.indexOf("genstatus") >= 0) && page === "genstatus") {
//       return true;
//     }
//     if ((currentPath.indexOf("nfts") >= 0) && page === "nfts") {
//       return true;
//     }
//     if ((currentPath.indexOf("marketplace") >= 0) && page === "marketplace") {
//       return true;
//     }
//     if ((currentPath.indexOf("nftstaking") >= 0) && page === "nftstaking") {
//       return true;
//     }
//     if ((currentPath.indexOf("play") >= 0) && page === "play") {
//       return true;
//     }
//     return false;
//   }, []);

//   return (
//     <>
//     <Paper className="dapp-sidebar">
//       <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
//         <div className="dapp-menu-top">
//           <Box className="branding-header">
//             <div>
//               <img src={Spinning} alt="spinning cheesedao logo" style={{height: "250px", width: "250px"}} />
//             </div>
//           </Box>

//           <div className="dapp-menu-links">
//             <div className="dapp-nav" id="navbarNav">
//               <Link
//                 component={NavLink}
//                 id="dash-nav"
//                 to="/"
//                 isActive={(match, location) => {
//                   return checkPage(match, location, "dashboard");
//                 }}
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row"}}
//               >
//                 <img src={HomeIcon} alt="dashboard icon" style={{height: "25px", width: "25px", marginRight: "5%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: "2%"}}>
//                   Dashboard
//                 </Typography>
//               </Link>

//               <Link
//                 component={NavLink}
//                 id="stake-nav"
//                 to="/play"
//                 isActive={(match, location) => {
//                   return checkPage(match, location, "play");
//                 }}
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row"}}
//               >
//                 <img src={ControllerIcon} alt="cheese block icon" style={{height: "30px", width: "25px", marginRight: "5%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: "2%"}}>
//                   Play
//                 </Typography>
//               </Link>

//               <Link
//                 component={NavLink}
//                 id="stake-nav"
//                 to="/ageing"
//                 isActive={(match, location) => {
//                   return checkPage(match, location, "ageing");
//                 }}
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row"}}
//               >
//                 <img src={CheeseIcon} alt="cheese block icon" style={{height: "25px", width: "25px", marginRight: "5%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: "2%"}}>
//                   Ageing
//                 </Typography>
//               </Link>
// {/* 
//               <Link
//                 component={NavLink}
//                 id="spawn-nav"
//                 to="/nftstaking"
//                 isActive={(match, location) => {
//                   return checkPage(match, location, "nftstaking");
//                 }}
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row"}}
//               >
//                 <img src={Factory} alt="factory icon" style={{height: "30px", marginRight: "5%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: ".5%"}}>
//                   CHEEZ Factory
//                 </Typography>
//               </Link> */}

//               <Link
//                 component={NavLink}
//                 id="spawn-nav"
//                 to="/nfts"
//                 isActive={(match, location) => {
//                   return checkPage(match, location, "nfts");
//                 }}
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row"}}
//               >
//                 <img src={UnlockIcon} alt="unlock icon" style={{height: "30px", marginRight: "5%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: ".5%"}}>
//                   My NFTs
//                 </Typography>
//               </Link>


//               <Link
//                 component={NavLink}
//                 id="spawn-nav"
//                 to="/marketplace"
//                 isActive={(match, location) => {
//                   return checkPage(match, location, "marketplace");
//                 }}
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row"}}
//               >
//                 <img src={ShoppingIcon} alt="marketplace icon" style={{height: "30px", width: "25px", marginRight: "5%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: ".5%"}}>
//                   Marketplace
//                 </Typography>
//               </Link>

//               <Link
//                 component={NavLink}
//                 id="bond-nav"
//                 to="/bonds"
//                 isActive={(match, location) => {
//                   return checkPage(match, location, "bonds");
//                 }}
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row"}}
//               >
//                 <img src={BondIcon} alt="bonding icon" style={{height: "25px", width: "25px", marginRight: "5%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: "2%"}}>
//                   Bond
//                 </Typography>
//               </Link>

//               <div className="dapp-menu-data discounts">
//                 <div className="bond-discounts">
//                   <Typography variant="body2">Bond discounts</Typography>
//                   {bonds.filter(b => b.isAvailable[chainID]).map((bond, i) => (
//                     <Link component={NavLink} to={`/bonds/${bond.name}`} key={i} className={"bond"}>
//                       {!bond.bondDiscount ? (
//                         <Skeleton variant="text" width={"150px"} />
//                       ) : (
//                         <Typography variant="body2">
//                           {bond.displayName}
//                           <span className="bond-pair-roi">
//                               {bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%
//                           </span>
//                         </Typography>
//                       )}
//                     </Link>
//                   ))}
//                 </div>

//                 <Link
//                 id="bridge-nav"
//                 href="https://synapseprotocol.com/?inputCurrency=USDC&outputCurrency=DAI&outputChain=1666600000"
//                 target="_blank"
//                 className={`button-dapp-menu ${isActive ? "active" : ""}`}
//                 style={{display: "flex", flexDirection: "row", marginTop: "8%"}}
//               >
//                 <img src={BridgeIcon} alt="bridge icon" style={{height: "25px", width: "25px", marginRight: "5%", marginTop: "2%"}} />
//                 <Typography variant="h6" style={{marginLeft: "5%", marginTop: "2%"}}>
//                   Bridge
//                 </Typography>
//               </Link>

//               </div>
//             </div>
//           </div>
//         </div>
//         <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
//           <div className="dapp-menu-external-links">
//             {Object.keys(externalUrls).map((link, i) => {
//               return (
//                 <Link key={i} href={`${externalUrls[link].url}`} target="_blank">
//                   <Typography variant="h6">{externalUrls[link].icon}</Typography>
//                   <Typography variant="h6">{externalUrls[link].title}</Typography>
//                 </Link>
//               );
//             })}
//           </div>
//             <Social />
//         </Box>
//       </Box>
//     </Paper>

//     </>
//   );
// }

// export default NavContent;
