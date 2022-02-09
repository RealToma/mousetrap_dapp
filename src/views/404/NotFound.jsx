import CatLogo from "../../assets/images/catandmouse.png";
import "./notfound.scss";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://olympusdao.finance" target="_blank">
          <img className="branding-header-icon" src={CatLogo} alt="CheeseDAO" />
        </a>

        <h4>Page not found</h4>
      </div>
    </div>
  );
}
