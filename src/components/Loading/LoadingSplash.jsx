import { Backdrop, Container, SvgIcon } from "@material-ui/core";
import Logo from "../Sidebar/catandmouse.png";
import "./loading.scss";

function LoadingSplash() {
  return (
    <Backdrop open={true} className="loading-splash" style={{ zIndex: 33, backdropFilter: "blur(33px)" }}>
      <Container justify="center" align="center">
        <img src={Logo} alt="MouseTrap Logo" />
      </Container>
    </Backdrop>
  );
}

export default LoadingSplash;
