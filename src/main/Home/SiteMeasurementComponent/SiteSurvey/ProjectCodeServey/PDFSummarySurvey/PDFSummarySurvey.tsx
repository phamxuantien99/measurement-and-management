import { useQuery } from "@tanstack/react-query";
import { CSSProperties, useMemo, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import ReactToPrint from "react-to-print";
import apiAxios from "../../../../../../api/api";
import logo2 from "../../../../../../assets/images/logo2.png";
import { api } from "../../../../../service/api/endpoint";
import "./PDFSummarySurvey.css";
const override: CSSProperties = {
  display: "flex",
  margin: "500px auto",
  borderColor: "red",
};
function PDFSummarySurvey() {
  const { project_number } = useParams(); // Lấy giá trị từ URL
  const invoiceContentRef = useRef<any>();
  const fetchDataSurveyReport = async (
    currentPage: number,
    status: string,
    searchValue: string
  ) => {
    try {
      const response = await apiAxios.get(
        api.getSurveyReport(currentPage, status, searchValue)
      );
      return response.data; // { founds: [], search_options: {} }
    } catch (error) {
      alert("Something went wrong, please login again!!");
      return { founds: [] }; // Tránh lỗi khi dữ liệu không có
    }
  };

  const { data: dataSurveyReport, isLoading: isLoadingDataSurveyReport } =
    useQuery({
      queryKey: ["dataSurveyReportConfirm", ""],
      queryFn: () => fetchDataSurveyReport(1, "confirm", ""),
      refetchOnWindowFocus: false,
    });

  // ✅ Dùng useMemo để lọc dữ liệu
  const filteredData = useMemo(() => {
    if (!dataSurveyReport || !dataSurveyReport.founds) return [];
    return dataSurveyReport.founds.filter(
      (item: any) => item.project_number === project_number
    );
  }, [isLoadingDataSurveyReport]);

  console.log("Filtered Data:", filteredData);

  if (isLoadingDataSurveyReport)
    return (
      <FadeLoader
        loading={isLoadingDataSurveyReport}
        cssOverride={override}
        color="red"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <div className="w-[1300px] mx-auto p-10">
      <div className="flex justify-between items-center">
        <div className="text-center mb-5">
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost gap-3 capitalize">
                <FcPrint size={24} />
                Print
              </button>
            )}
            documentTitle={project_number}
            content={() => invoiceContentRef.current}
            pageStyle={`
          @page { margin: 20mm; }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .print-content {
              position: relative;
            }
            .page-break {
                page-break-before: always;
            }
            .no-page-break {
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
      </div>
      <div>
        <div
          id="capture"
          className="invoice-container page"
          ref={invoiceContentRef}
        >
          <div
          // key={index}
          // className={index === 0 ? "no-page-break" : "page-break"}
          >
            <div className="flex gap-10 justify-between items-center mt-10 border-b border-solid border-gray-400 pb-3 w-5/6 mx-auto">
              <img src={logo2} alt="logo" className="w-[300px]" />

              <div className="text-right text-sm">
                <p className="font-bold text-blue-600">
                  No.34 Loyang Crescent <br /> Singapore 508993
                </p>
                <p>
                  <strong>T:</strong>{" "}
                  <a href="tel:+6562857813">+65 6285 7813</a>
                </p>
                <p>
                  <strong>E:</strong>{" "}
                  <a href="mailto:enquiry@deltatech.com.sg">
                    enquiry@deltatech.com.sg
                  </a>
                </p>
                <p>
                  <strong>W:</strong>{" "}
                  <a target="_black" href="www.deltatech.com.sg">
                    www.deltatech.com.sg
                  </a>
                </p>
              </div>
            </div>

            <table style={{ width: "100%", marginTop: "20px" }}>
              <thead>
                <tr style={{ backgroundColor: "#E5E7EB" }}>
                  <th
                    style={{ textAlign: "center", padding: 10, fontSize: 20 }}
                    colSpan={4}
                  >
                    SUMMARY SURVEY FORM FOR DOOR
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={4}
                    style={{ textAlign: "center", padding: 10, fontSize: 16 }}
                  >
                    Survey door overview reference:{" "}
                    {filteredData[0]?.project_number}
                    -SMS-001
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left" }}>Project:</th>
                  <td style={{ textAlign: "left" }}>
                    {filteredData[0]?.project_number}
                  </td>
                  <th style={{ textAlign: "left" }}>Customer Name:</th>
                  <td style={{ textAlign: "left" }}>
                    {filteredData[0]?.client_name}
                  </td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left" }}>Date:</th>
                  <td style={{ textAlign: "left" }}>
                    {filteredData[0]?.date_create}
                  </td>
                  <th style={{ textAlign: "left" }}>Location:</th>
                  <td style={{ textAlign: "left" }}>
                    {filteredData[0]?.location}
                  </td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left" }}>POC:</th>
                  <td style={{ textAlign: "left" }}>
                    {filteredData[0]?.person_contact}
                  </td>
                  <th style={{ textAlign: "left" }}>Telephone Number:</th>
                  <td style={{ textAlign: "left" }}>
                    {filteredData[0]?.telephone_number}
                  </td>
                </tr>
              </tbody>
            </table>

            <table>
              <thead>
                <tr>
                  <th rowSpan={2}>No</th>
                  <th rowSpan={2}>Shutter Type</th>
                  <th rowSpan={2}>Shutter No</th>
                  <th rowSpan={2}>L1(mm)</th>
                  <th rowSpan={2}>H1(mm)</th>
                  <th rowSpan={2}>Installation Position</th>
                  <th rowSpan={2}>Finishing</th>
                  <th colSpan={2}>Motor</th>

                  <th rowSpan={2}>Lintel</th>
                  <th rowSpan={2}>Stiffenter</th>
                  <th rowSpan={2}>Remark</th>
                </tr>
                <tr>
                  <th>LH</th>
                  <th>RH</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.type_of_shutter}</td>
                    <td>{item.shutter_number}</td>
                    <td>{item.opening_width}</td>
                    <td>{item.opening_height}</td>
                    <td>{item.installation_position}</td>
                    <td>{item.finishing}</td>
                    <td>{item.motor_side}</td>
                    <td>{item.motor_side}</td>

                    <td>{item.lintel ? "Ready" : "No Ready"}</td>
                    <td>{item.stiffer ? "Ready" : "No Ready"}</td>
                    <td>{item.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFSummarySurvey;
