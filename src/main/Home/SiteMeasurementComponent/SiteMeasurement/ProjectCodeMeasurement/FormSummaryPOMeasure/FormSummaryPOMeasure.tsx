import { useQuery } from "@tanstack/react-query";
import { CSSProperties, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import ReactToPrint from "react-to-print";

import logo2 from "../../../../../../assets/images/logo2.png";

import "./FormSummaryPOMeasure.css";
import apiAxios from "../../../../../../api/api";
import { api } from "../../../../../service/api/endpoint";
const override: CSSProperties = {
  display: "flex",
  margin: "500px auto",
  borderColor: "red",
};
function FormSummaryPOMeasure() {
  const { project_number } = useParams(); // Lấy giá trị từ URL
  const invoiceContentRef = useRef<any>();

  const fetchDataSummaryReport = async (project_number: string) => {
    try {
      const response = await apiAxios.get(
        api.getMeasurementReportSummary(project_number)
      );
      return response.data; // { confirm_projects: [], search_options: {} }
    } catch (error) {
      alert("Something went wrong, please login again!!");
      return { error: "Failed to fetch data" };
    }
  };

  const {
    data: dataSummaryReportMeasurement,
    isLoading: isDataSummaryReportMeasurement,
  } = useQuery({
    queryKey: ["dataSummaryReportMeasurement", project_number],
    queryFn: () => fetchDataSummaryReport(project_number as string),
    refetchOnWindowFocus: false, // Không gọi lại API khi chuyển tab
    enabled: !!project_number, // Chỉ gọi API khi project_number có giá trị
  });

  if (isDataSummaryReportMeasurement)
    return (
      <FadeLoader
        loading={isDataSummaryReportMeasurement}
        cssOverride={override}
        color="red"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  console.log({ dataSummaryReportMeasurement });

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
          <div>
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
                    SUMMARY MEASUREMENT FORM FOR DOOR
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={4}
                    style={{ textAlign: "center", padding: 10, fontSize: 16 }}
                  >
                    Measurement door overview reference:{" "}
                    {
                      dataSummaryReportMeasurement?.list_measurements[0]
                        ?.project_number
                    }
                    -SMS-001
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left", fontSize: "13.5px" }}>
                    Project:
                  </th>
                  <td style={{ textAlign: "left", fontSize: "13.5px" }}>
                    {
                      dataSummaryReportMeasurement?.list_measurements[0]
                        ?.project_number
                    }
                  </td>
                  <th style={{ textAlign: "left", fontSize: "13.5px" }}>
                    Customer Name:
                  </th>
                  <td style={{ textAlign: "left", fontSize: "13.5px" }}>
                    {
                      dataSummaryReportMeasurement?.list_measurements[0]
                        ?.client_name
                    }
                  </td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", fontSize: "13.5px" }}>
                    Date:
                  </th>
                  <td style={{ textAlign: "left", fontSize: "13.5px" }}>
                    {
                      dataSummaryReportMeasurement?.list_measurements[0]
                        ?.date_create
                    }
                  </td>
                  <th style={{ textAlign: "left", fontSize: "13.5px" }}>
                    Location:
                  </th>
                  <td style={{ textAlign: "left", fontSize: "13.5px" }}>
                    {
                      dataSummaryReportMeasurement?.list_measurements[0]
                        ?.location
                    }
                  </td>
                </tr>
                <tr>
                  <th style={{ textAlign: "left", fontSize: "13.5px" }}>
                    POC:
                  </th>
                  <td style={{ textAlign: "left", fontSize: "13.5px" }}>
                    {
                      dataSummaryReportMeasurement?.list_measurements[0]
                        ?.person_contact
                    }
                  </td>
                  <th style={{ textAlign: "left", fontSize: "13.5px" }}>
                    Telephone Number:
                  </th>
                  <td style={{ textAlign: "left", fontSize: "13.5px" }}>
                    {
                      dataSummaryReportMeasurement?.list_measurements[0]
                        ?.telephone_number
                    }
                  </td>
                </tr>
              </tbody>
            </table>

            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    No
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Shutter Type
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Shutter No
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    L1(mm)
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    H1(mm)
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Installation Position
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Finishing
                  </th>
                  <th colSpan={2} style={{ fontSize: "13.5px" }}>
                    Motor
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Serial
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Lintel
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Stiffenter
                  </th>
                  <th rowSpan={2} style={{ fontSize: "13.5px" }}>
                    Remark
                  </th>
                </tr>
                <tr>
                  <th style={{ fontSize: "13.5px" }}>LH</th>
                  <th style={{ fontSize: "13.5px" }}>RH</th>
                </tr>
              </thead>
              <tbody>
                {dataSummaryReportMeasurement?.list_measurements.map(
                  (item: any, index: number) => (
                    <tr key={index}>
                      <td style={{ fontSize: "13.5px" }}>{index + 1}</td>
                      <td style={{ fontSize: "13.5px" }}>
                        {item.shutter_type}
                      </td>
                      <td style={{ fontSize: "13.5px" }}>{item.shutter_no}</td>
                      <td style={{ fontSize: "13.5px" }}>
                        {item.opening_length}
                      </td>
                      <td style={{ fontSize: "13.5px" }}>
                        {item.opening_height}
                      </td>
                      <td style={{ fontSize: "13.5px" }}>
                        {item.installation_position}
                      </td>
                      <td style={{ fontSize: "13.5px" }}>{item.finishing}</td>
                      <td style={{ fontSize: "13.5px" }}>{item.motor_side}</td>
                      <td style={{ fontSize: "13.5px" }}>{item.motor_side}</td>
                      <td style={{ fontSize: "13.5px" }}>{item.serial_no}</td>
                      <td style={{ fontSize: "13.5px" }}>
                        {item.lintel ? "Ready" : "No Ready"}
                      </td>
                      <td style={{ fontSize: "13.5px" }}>
                        {item.stiffer ? "Ready" : "No Ready"}
                      </td>
                      <td style={{ fontSize: "13.5px" }}>{item.remarks}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormSummaryPOMeasure;
