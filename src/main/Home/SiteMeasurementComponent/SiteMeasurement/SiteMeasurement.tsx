import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";
import ConfirmMeasurement from "./ConfirmMeasurement/ConfirmMeasurement";
import ProjectCodeMeasurement from "./ProjectCodeMeasurement/ProjectCodeMeasurement";
import UnconfirmMeasurement from "./UnconfirmMeasurement/UnconfirmMeasurement";

const SiteMeasurement = () => {
  const { selectedAnalysis } = useContext(AuthContext) as AuthContextType;
  return (
    <div>
      <div className="mt-5">
        {selectedAnalysis === "summary-report" && <ProjectCodeMeasurement />}
        {selectedAnalysis === "confirm" && <ConfirmMeasurement />}
        {selectedAnalysis === "unconfirmed" && <UnconfirmMeasurement />}
      </div>
    </div>
  );
};

export default SiteMeasurement;
