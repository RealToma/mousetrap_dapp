import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as GriftIcon } from "../../assets/icons/grift.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";

const externalUrls = [
  {
    title: "Docs",
    url: "https://docs.cheesedao.xyz/",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
  {
    title: "Merch",
    url: "https://grift.shop/collections/cheesedao",
    icon: <GriftIcon />,
  }
];

export default externalUrls;
