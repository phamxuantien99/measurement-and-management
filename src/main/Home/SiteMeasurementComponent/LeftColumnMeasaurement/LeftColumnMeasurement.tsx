import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiAxios from "../../../../api/api";
import logo1 from "../../../../assets/images/logo1.png";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";
import { api } from "../../../service/api/endpoint";

type FormFields = {
  startDate: string;
  endDate: string;
};

const LeftColumnMeasurement = () => {
  const { selectReportAnalysisMeasurement, setDataAnalysisMeasurement } =
    useContext(AuthContext) as AuthContextType;
  const generateInvoiceFormRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [filteredEndDate, setFilteredEndDate] = useState<string>("");
  // const [filterDateEndForInvoice, setFilterDateEndForInvoice] =
  //   useState<string>("");
  const [filteredStartDate, setFilteredStartDate] = useState<string>("");
  // const [filterDateStartForInvoice, setFilterDateStartForInvoice] =
  //   useState<string>("");
  const [listError, setListError] = useState<FormFields>({
    startDate: "",
    endDate: "",
  });

  const _filterStartDate = (date: Date | null) => {
    setSelectedStartDate(date);
    setFilteredStartDate(
      date?.getFullYear() +
        "-" +
        ((date?.getMonth() as number) + 1) +
        "-" +
        date?.getDate()
    );
    // setFilterDateStartForInvoice(
    //   date?.getDate() +
    //     "-" +
    //     ((date?.getMonth() as number) + 1) +
    //     "-" +
    //     date?.getFullYear()
    // );
  };

  const _filterEndDate = (date: Date | null) => {
    setSelectedEndDate(date);
    setFilteredEndDate(
      date?.getFullYear() +
        "-" +
        ((date?.getMonth() as number) + 1) +
        "-" +
        date?.getDate()
    );
    // setFilterDateEndForInvoice(
    //   date?.getDate() +
    //     "-" +
    //     ((date?.getMonth() as number) + 1) +
    //     "-" +
    //     date?.getFullYear()
    // );
  };

  const updateFieldError = (fieldName: string, error: string) => {
    setListError((prevErrrors) => ({
      ...prevErrrors,
      [fieldName]: error,
    }));
  };

  const validateFields = (): boolean => {
    let isValid = true; // Assume fields are valid initially

    // Validation for startDate
    if (!filteredStartDate.trim()) {
      updateFieldError("startDate", "Field Start date is required.");
      isValid = false;
    } else {
      updateFieldError("startDate", "");
    }

    // Validation for endDate
    if (!filteredEndDate.trim()) {
      updateFieldError("endDate", "Field End date is required.");
      isValid = false;
    } else {
      updateFieldError("endDate", "");
    }

    return isValid; // Return true if no errors, false if any errors
  };

  useEffect(() => {
    setFilteredEndDate("");
    setFilteredStartDate("");
    setListError({
      startDate: "",
      endDate: "",
    });

    setSelectedEndDate(null);
    setSelectedStartDate(null);
  }, [selectReportAnalysisMeasurement]);

  const handleGenAnalysis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }

    let apiCall = api.getAnalysisReport({
      start_date: filteredStartDate,
      end_date: filteredEndDate,
    });

    try {
      setIsSubmitted(true);
      const res = await apiAxios.post(apiCall);
      await setDataAnalysisMeasurement(res.data);
      console.log("object", res);
    } catch (error) {
      console.log("object", error);
    } finally {
      setIsSubmitted(false);
    }
  };
  return (
    <form
      ref={generateInvoiceFormRef}
      className="flex flex-col gap-5 mb-7 p-7 border-2 rounded-2xl shadow-2xl w-full md:min-w-[400px] bg-white"
      onSubmit={(event) => handleGenAnalysis(event)}
    >
      <div className="flex justify-between items-center">
        <img className="w-[500px]" src={logo1} alt="logo" />
      </div>
      {/* form */}
      <div className="grid gap-5">
        <div className="space-y-3">
          {/* Start Date */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <DatePicker
              className="input input-bordered w-full"
              selected={selectedStartDate}
              onChange={(date) => {
                _filterStartDate(date);
                updateFieldError("startDate", "");
              }}
              placeholderText="YYYY/MM/DD"
              dateFormat="yyyy/MM/dd"
              showYearDropdown
              showMonthDropdown
              popperPlacement="top"
              disabled={
                selectReportAnalysisMeasurement === "list-report-measurement"
              }
            />
          </div>
          {listError.startDate && (
            <p className="text-red-500">{listError.startDate}</p>
          )}

          {/* End Date */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <DatePicker
              className="input input-bordered w-full"
              selected={selectedEndDate}
              onChange={(date) => {
                _filterEndDate(date);

                updateFieldError("endDate", "");
              }}
              placeholderText="YYYY/MM/DD"
              dateFormat="yyyy/MM/dd"
              showYearDropdown
              showMonthDropdown
              popperPlacement="top"
              disabled={
                selectReportAnalysisMeasurement === "list-report-measurement"
              }
            />
          </div>
          {listError.endDate && (
            <p className="text-red-500">{listError.endDate}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={`btn btn - primary 
      ${isSubmitted && "loading"}
      `}
        disabled={selectReportAnalysisMeasurement === "list-report-measurement"}
      >
        Generate Analysis For Measurement
      </button>
    </form>
  );
};

export default LeftColumnMeasurement;
