import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../../context/AuthProvider";

const GenerateForDate = () => {
  const { dataAnalysisMeasurement } = useContext(
    AuthContext
  ) as AuthContextType;
  return (
    <div className="flex justify-center">
      {" "}
      {dataAnalysisMeasurement?.analysis_measurement_img ? (
        <img
          src={`data:image/jpeg;base64,${dataAnalysisMeasurement?.analysis_measurement_img}`}
          alt="Loaded from API"
          className="w-[850px] h-[550px] text-center"
        />
      ) : (
        <p className="flex-1 text-center">There is no data to display</p>
      )}
    </div>
  );
};

export default GenerateForDate;
