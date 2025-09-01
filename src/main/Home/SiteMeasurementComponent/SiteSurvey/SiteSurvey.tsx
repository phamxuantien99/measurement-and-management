import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";
import ProjectCodeServey from "./ProjectCodeServey/ProjectCodeServey";
import ConfirmServey from "./ConfirmServey/ConfirmServey";
import UnconfirmServey from "./UnconfirmServey/UnconfirmServey";

const SiteServey = () => {
  const { selectedAnalysis } = useContext(AuthContext) as AuthContextType;
  return (
    <div>
      <div className="mt-5">
        {selectedAnalysis === "summary-report" && <ProjectCodeServey />}
        {selectedAnalysis === "confirm" && <ConfirmServey />}
        {selectedAnalysis === "unconfirmed" && <UnconfirmServey />}
      </div>
    </div>
  );
};

export default SiteServey;
