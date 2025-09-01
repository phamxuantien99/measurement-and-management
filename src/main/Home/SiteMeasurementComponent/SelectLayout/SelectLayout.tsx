import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";

const dataSelectOption = [
  "list-report-measurement",
  "generate-analysis-report-measurement",
];

const SelectLayout = () => {
  const {
    setSelectReportAnalysisMeasurement,
    setDataAnalysisMeasurement,
    selectReportAnalysisMeasurement,
  } = useContext(AuthContext) as AuthContextType;

  const handleButtonClick = (value: string) => {
    setSelectReportAnalysisMeasurement(value);
    setDataAnalysisMeasurement({});
  };

  return (
    <div className="flex flex-wrap gap-2">
      {dataSelectOption.map((item, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(item)}
          className={`btn w-auto text-[15px] capitalize ${
            selectReportAnalysisMeasurement === item
              ? "bg-[#22ABE0] border-[#22ABE0]"
              : "bg-[#27B770] border-[#27B770] hover:bg-[#22ABE0] hover:border-[#22ABE0]"
          }`}
        >
          {item.replace(/-/g, " ")}
        </button>
      ))}
    </div>
  );
};

export default SelectLayout;
