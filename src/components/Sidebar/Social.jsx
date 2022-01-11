import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../assets/icons/github.svg";
import { ReactComponent as Medium } from "../../assets/icons/medium.svg";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { Button } from 'react-bootstrap'

import './sidebar.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Social() {
  return (
    <>
      <div className="social">
        <div className="icon">
          <Button>
            <img src={require('./discord.png').default} alt="" />
          </Button>
          <Button>
            <img src={require('./twitter.png').default} alt="" />
          </Button>
          <Button>
            <img src={require('./medium-monogram.png').default} alt="" />
          </Button>
          <Button>
            <img src={require('./github.png').default} alt="" />
          </Button>
        </div>
      </div>
    </>
    // <div className="social-row">
    //   <Link href="https://github.com/CatAndMouseDAO" target="_blank">
    //     <SvgIcon color="primary" component={GitHub} />
    //   </Link>

    //   <Link href="https://medium.com/@mousetrapfinance/cheesedao-in-the-dawn-of-blockchain-gaming-9fe40a26e38" target="_blank">
    //     <SvgIcon color="primary" component={Medium} />
    //   </Link>

    //   <Link href="https://twitter.com/CheezDAO" target="_blank">
    //     <SvgIcon color="primary" component={Twitter} />
    //   </Link>

    //   <Link href="https://discord.gg/cheesedao" target="_blank">
    //     <SvgIcon color="primary" component={Discord} />
    //   </Link>
    // </div>
  );
}
