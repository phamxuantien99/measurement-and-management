import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";

const dataSelectOption = [
  {
    text: "summary report",
    value: "summary-report",
  },
  {
    text: "confirm",
    value: "confirm",
  },
  {
    text: "unconfirmed",
    value: "unconfirmed",
  },
];
const dataSelectOptionMeasurement = [
  {
    text: "summary measurement",
    value: "summary-report",
  },
  {
    text: "ongoing",
    value: "confirm",
  },
  {
    text: "non-confirmed",
    value: "unconfirmed",
  },
];

const SelectReport = () => {
  const { setSelectedAnalysis, selectedAnalysis, selectSite } = useContext(
    AuthContext
  ) as AuthContextType;

  const handleButtonClick = (value: string) => {
    setSelectedAnalysis(value);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-start mb-4">
      {(selectSite === "Site Measurement"
        ? dataSelectOptionMeasurement
        : dataSelectOption
      ).map((item, index) => {
        const isActive = selectedAnalysis === item?.value;
        return (
          <button
            key={index}
            onClick={() => handleButtonClick(item.value)}
            className={`px-6 py-2 rounded-full border font-medium text-sm transition-all duration-200 capitalize
            ${
              isActive
                ? "bg-[#22ABE0] text-white border-[#22ABE0] shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-[#22ABE0] hover:text-white hover:border-[#22ABE0]"
            }`}
          >
            {item.text.replace(/-/g, " ")}
          </button>
        );
      })}
    </div>
  );
};

export default SelectReport;
