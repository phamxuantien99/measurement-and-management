import { useContext, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import ReactToPrint from "react-to-print";
import LogoCompany from "../../../../assets/images/OnlyLogo.jpg";
import { formatDate } from "../../../../util/helper/helper";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";
import GenerateForDate from "./GenerateForDate/GenerateForDate";

const GenerateAnalysisForMeasurement = () => {
  const { dataAnalysisMeasurement } = useContext(
    AuthContext
  ) as AuthContextType;
  const invoiceContentRef = useRef<any>();

  const today = new Date();

  const day = today.getDate();
  const month = today.getMonth() + 1; // Tháng bắt đầu từ 0, nên phải cộng thêm 1
  const year = today.getFullYear();
  return (
    <div>
      <div>
        {/* Print Content PDF button */}
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-ghost gap-3 capitalize">
              <FcPrint size={24} />
              Print
            </button>
          )}
          content={() => invoiceContentRef.current}
          documentTitle={dataAnalysisMeasurement?.report_reference}
          pageStyle={`
          @page { margin: 20mm; size: A4 landscape !important; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .print-content {
              position: relative;
            }
            .page-break {
              margin-top: 30px,
              page-break-before: always;
              page-break-inside: avoid;
            }
            .no-page-break {
              margin-top: 30px,
              page-break-before: auto;
            }
            .page-number {
              position: fixed;
              bottom: 10mm;
              right: 10mm;
              color: black;
            }
          }
        `}
        />
      </div>

      <div className="bg-white p-2 page" ref={invoiceContentRef} id="printable">
        {dataAnalysisMeasurement?.start_date ? (
          <div>
            {/* Header total */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={LogoCompany}
                  alt="Logo Company"
                  className="w-[35px] h-[60px]"
                />
                <div className="flex flex-col gap-2">
                  <h1 className={"text-[22px]"}>Analysis Measurement Report</h1>
                  <div>
                    <p className="flex gap-2 text-base">
                      Date Range:{" "}
                      <span className="font-semibold">
                        {dataAnalysisMeasurement?.start_date &&
                          formatDate(dataAnalysisMeasurement?.start_date)}{" "}
                        to{" "}
                        {dataAnalysisMeasurement?.end_date &&
                          formatDate(dataAnalysisMeasurement?.end_date)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className={`${"text-base"}`}>
                  Date Generated:{" "}
                  <span className="font-semibold">
                    {day}-{month}-{year}
                  </span>
                </p>
                <p className="flex gap-2 text-base">
                  Reference report number:
                  <span className="font-semibold">
                    {dataAnalysisMeasurement?.report_reference}
                  </span>
                </p>
              </div>
            </div>
            {/* dâta show */}
            <div>
              <GenerateForDate />
            </div>
          </div>
        ) : (
          <p className="text-center">There is no data to display</p>
        )}
      </div>
    </div>
  );
};

export default GenerateAnalysisForMeasurement;
