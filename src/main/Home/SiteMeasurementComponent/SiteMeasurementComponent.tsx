import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../context/AuthProvider";
import SiteMeasurement from "./SiteMeasurement/SiteMeasurement";
import SiteSurvey from "./SiteSurvey/SiteSurvey";
import SelectValue from "./SelectValue/SelectValue";
import SelectReport from "./SelectReport/SelectReport";
import LeftColumnMeasurement from "./LeftColumnMeasaurement/LeftColumnMeasurement";
import SelectLayout from "./SelectLayout/SelectLayout";
import GenerateAnalysisForMeasurement from "./GenerateAnalysisForMesurement/GenerateAnalysisForMeasurement";

const SiteMeasurementComponent = () => {
  const { selectSite, selectReportAnalysisMeasurement } = useContext(
    AuthContext
  ) as AuthContextType;
  return (
    <div className="bg-[#0d75be] min-h-screen no-scroll">
      <div className="grid xl:grid-cols-4">
        <div className="xl:col-span-1 p-5 flex items-center justify-center glass min-h-screen">
          <LeftColumnMeasurement />
        </div>

        <div className="xl:col-span-3 max-h-[100vh] overflow-y-auto p-5">
          <div>
            <SelectLayout />
            {selectReportAnalysisMeasurement === "list-report-measurement" ? (
              <div>
                <div className="flex my-5 justify-between items-center">
                  <SelectValue />
                  <SelectReport />
                </div>
                {selectSite === "Site Measurement" && <SiteMeasurement />}

                {selectSite === "Site Survey" && <SiteSurvey />}
              </div>
            ) : (
              <div className="my-5">
                <GenerateAnalysisForMeasurement />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMeasurementComponent;
