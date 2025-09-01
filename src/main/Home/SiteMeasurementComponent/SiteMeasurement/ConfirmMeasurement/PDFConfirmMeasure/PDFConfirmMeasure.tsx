import { useQuery } from "@tanstack/react-query";
import { CSSProperties, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import ReactToPrint from "react-to-print";

import logo2 from "../../../../../../assets/images/logo2.png";

import PictureSmall from "../../../../../../assets/images/Screenshot 2025-07-14 173445.png";
import PictureLarge from "../../../../../../assets/images/Screenshot 2025-07-14 173549.png";
import "./PDFConfirmMeasure.css";
import apiAxios from "../../../../../../api/api";
import { api } from "../../../../../service/api/endpoint";

const override: CSSProperties = {
  display: "flex",
  margin: "500px auto",
  borderColor: "red",
};
function PDFConfirmMeasure() {
  const { id } = useParams();
  const invoiceContentRef = useRef<any>();
  const NumberId = Number(id);

  const fetchDataDetailById = async (idReport: number) => {
    try {
      const response = await apiAxios.get(
        api.getDetailMeasurementReport(idReport)
      );
      return response.data; // { confirm_projects: [], search_options: {} }
    } catch (error) {
      alert("Something went wrong, please login again!!");
      return { error: "Failed to fetch data" };
    }
  };

  const {
    data: dataDetailReportMeasurement,
    isLoading: isDataDetailReportMeasurement,
  } = useQuery({
    queryKey: ["dataDetailReportMeasurement", NumberId],
    queryFn: () => fetchDataDetailById(NumberId),
    refetchOnWindowFocus: false, // Không gọi lại API khi chuyển tab
    enabled: !!NumberId,
  });

  if (isDataDetailReportMeasurement)
    return (
      <FadeLoader
        loading={isDataDetailReportMeasurement}
        cssOverride={override}
        color="red"
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <div className="w-[1300px] mx-auto p-[3px]0">
      <div className="flex justify-between dataDetailReportMeasurements-center">
        <div className="text-center mb-5">
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost gap-3 capitalize">
                <FcPrint size={24} />
                Print
              </button>
            )}
            documentTitle={`${dataDetailReportMeasurement?.project_number}-Measurement-${dataDetailReportMeasurement?.id}`}
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
          <div className="page-break">
            <div
              id="capture"
              className="invoice-container position: relative;  background-color: #ffffff; overflow: hidden; width: 250mm; min-height: 280mm;  margin: auto; background: white; "
            >
              <div className="display: flex; items-center: center; padding: 1px 20px; justify-content: space-around;">
                <div className="flex gap-[3px]0 justify-between items-center mt-10 border-b border-solid border-gray-400 pb-3 w-5/6 mx-auto margin-bottom-5">
                  <img src={logo2} alt="logo" className="w-[300px]" />

                  <div className="text-right text-[10px]">
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

                <table className="w-full border-collapse mt-5">
                  <colgroup>
                    {[...Array(8)].map((_, i) => (
                      <col key={i} style={{ width: "12.5%" }} />
                    ))}
                  </colgroup>

                  <thead>
                    <tr className="bg-gray-200">
                      <th colSpan={8} className="text-center p-2 text-[16px]">
                        DETAIL MEASUREMENT FORM FOR DOOR
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <th className="text-right p-[3px] text-[10px]">
                        Project Ref No:
                      </th>
                      <td className="text-center p-[3px] text-[10px]">
                        {dataDetailReportMeasurement?.project_number}
                      </td>

                      <th className="text-right p-[3px] text-[10px]">Date:</th>
                      <td className="text-center p-[3px] text-[10px]">
                        {dataDetailReportMeasurement?.date_create}
                      </td>

                      <th className="text-right p-[3px] text-[10px]">
                        Customer Name:
                      </th>
                      <td className="text-center p-[3px] text-[10px]">
                        {dataDetailReportMeasurement?.client_name}
                      </td>

                      <th className="text-right p-[3px] text-[10px]">
                        Measure by:
                      </th>
                      <td className="text-center p-[3px] text-[10px]">
                        {dataDetailReportMeasurement?.created_by}
                      </td>
                    </tr>

                    <tr>
                      <th className="text-right p-[3px] text-[10px]">
                        Job Site:
                      </th>
                      <td className="text-center p-[3px] text-[10px]">
                        {dataDetailReportMeasurement?.location}
                      </td>

                      <th className="text-right p-[3px] text-[10px]">
                        Contact:
                      </th>
                      <td className="text-center p-[3px] text-[10px]">
                        {dataDetailReportMeasurement?.person_contact}
                      </td>

                      <th
                        className="text-right p-[3px] text-[10px] capitalize"
                        colSpan={2}
                      >
                        Measurement reference Number:
                      </th>
                      <td
                        className="text-center p-[3px] text-[10px]"
                        colSpan={2}
                      >
                        {dataDetailReportMeasurement?.project_number}-SiteMea-
                        {dataDetailReportMeasurement?.id}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table
                  className="width: 100%; border-collapse: collapse;"
                  style={{ border: "1px solid black" }}
                >
                  <colgroup>
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "12.5%" }} />

                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "27.5%" }} />
                  </colgroup>

                  <tr>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Shutter Type:
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.shutter_type}
                    </td>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Shutter No:
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.shutter_no}
                    </td>

                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "14px",
                        fontWeight: "bold",
                        border: "1px solid black",
                      }}
                    >
                      Site Conditions
                    </td>
                  </tr>

                  <tr>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Opening Length (A):
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.opening_length}
                    </td>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Opening Height (B):
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.opening_height}
                    </td>

                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        fontWeight: "bold",
                        border: "1px solid black",
                      }}
                    >
                      Structural
                    </td>
                  </tr>

                  <tr>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Shutter opening (C):
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.shutter_opening}
                    </td>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Lintel Height (D):
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.lintel_height}
                    </td>

                    <th
                      colSpan={1}
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                    >
                      Structural
                    </th>
                    <td
                      colSpan={1}
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                    >
                      Yes
                    </td>
                    <td
                      colSpan={1}
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                    >
                      No
                    </td>
                    <td
                      colSpan={1}
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                    >
                      By/Remarks
                    </td>
                  </tr>

                  <tr>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Finishing:
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.finishing}
                    </td>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Motor side:
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.motor_side}
                    </td>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                    >
                      Lintel
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {/* {dataDetailReportMeasurement?.lintel ? '<span class="dot"></span>' : ""} */}
                      {dataDetailReportMeasurement?.lintel ? (
                        <GoDotFill size={16} className="text-black" />
                      ) : (
                        <></>
                      )}
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {/* {dataDetailReportMeasurement?.lintel ? "" : '<span class="dot"></span>'} */}
                      {dataDetailReportMeasurement?.lintel ? (
                        <></>
                      ) : (
                        <GoDotFill size={16} className="text-black" />
                      )}
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.lintel_remark}
                    </th>
                  </tr>

                  <tr>
                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Installation Type:
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.installation_position}
                    </td>

                    <th
                      style={{
                        textAlign: "right",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      Serial No:
                    </th>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.serial_no}
                    </td>

                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                    >
                      Stiffer
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {/* {dataDetailReportMeasurement?.stiffer ? '<span class="dot"></span>' : ""} */}
                      {dataDetailReportMeasurement?.stiffer ? (
                        <GoDotFill size={16} className="text-black" />
                      ) : (
                        <></>
                      )}
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {/* {dataDetailReportMeasurement?.stiffer ? "" : '<span class="dot"></span>'} */}
                      {dataDetailReportMeasurement?.stiffer ? (
                        <></>
                      ) : (
                        <GoDotFill size={16} className="text-black" />
                      )}
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "3px",
                        textTransform: "capitalize",
                        fontSize: "10px",
                        border: "1px solid black",
                      }}
                      colSpan={1}
                    >
                      {dataDetailReportMeasurement?.stiffer_remark}
                    </th>
                  </tr>
                </table>

                <table className="width: 100%; border-collapse: collapse;">
                  <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "27.5%" }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th colSpan={1} rowSpan={7}>
                        <img
                          style={{ width: "250px", height: "auto" }}
                          src={PictureLarge}
                          alt="logo"
                        />
                      </th>
                      <th colSpan={1} rowSpan={7}>
                        <img
                          style={{ width: "150px", height: "auto" }}
                          src={PictureSmall}
                          alt="logo"
                        />
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Obstruction
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.obstruction ? (
                          <GoDotFill size={16} className="text-black" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.obstruction ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="text-black" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.obstruction_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Wall condition
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.wall_condition ? (
                          <GoDotFill size={16} className="text-black" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.wall_condition ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="text-black" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.wall_condition_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Others
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.other ? (
                          <GoDotFill size={16} className="text-black" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.other ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="text-black" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.other_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                      >
                        Electrical
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      ></th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        Yes
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        No
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        By/Remarks
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Power
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.power ? (
                          <GoDotFill size={16} className="text-black" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.power ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="text-black" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.power_remark}
                      </th>
                    </tr>
                  </tbody>
                </table>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <colgroup>
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "27.5%" }} />
                    <col style={{ width: "12.5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "27.5%" }} />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                      >
                        Accessories
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Fire Alarm
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.fire_alarm ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.fire_alarm ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.fire_alarm_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      ></th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        Yes
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        No
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        By/Remarks
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "14px",
                        }}
                        colSpan={4}
                      >
                        Installation Method
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        UPS Battery
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.eps_battery ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.eps_battery ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.eps_battery_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                      >
                        Delivery (Vertical & Horizontal)
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        BMS Module
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.bms_module ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.bms_module ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.bms_module_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      ></th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Yes
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        No
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        By/Remarks
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Safety Edge
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.safety_edge ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.safety_edge ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.safety_edge_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Trolley
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.trolley ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.trolley ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.trolley_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Front Cover
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.front_cover ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.front_cover ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.front_cover_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Forklift
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.forklift ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.forklift ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.forklift_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                      >
                        Working Platform
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Crane
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.crane ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.crane ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.crane_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      ></th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Yes
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        No
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        By/Remarks
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Manual
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.manual ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.manual ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.manual_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Ladders
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.ladders ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.ladders ? (
                          <> </>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.ladders_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                      >
                        Hoisting
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Scaffolding
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.scaffolding ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.scaffolding ? (
                          <> </>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.scaffolding_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      ></th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Yes
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        No
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        By/Remarks
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Scissor Lift
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.scissor_lift ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <> </>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.scissor_lift ? (
                          <> </>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.scissor_lift_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Chain Block
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.chain_block ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <></>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.chain_block ? (
                          <></>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.chain_block_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Boom Lift
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.boom_lift ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <> </>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.boom_lift ? (
                          <> </>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.boom_lift_remark}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Forklift
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_forklift ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <> </>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_forklift ? (
                          <> </>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_forklift_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                        rowSpan={2}
                      >
                        Remarks:{" "}
                        <span>{dataDetailReportMeasurement?.remarks}</span>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Crane
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_crane ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <> </>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_crane ? (
                          <> </>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_crane_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        Manual
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_manual ? (
                          <GoDotFill size={16} className="dot" />
                        ) : (
                          <> </>
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_manual ? (
                          <> </>
                        ) : (
                          <GoDotFill size={16} className="dot" />
                        )}
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                      >
                        {dataDetailReportMeasurement?.hoisting_manual_remark}
                      </th>
                    </tr>
                    <tr>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                      >
                        PHOTO 1 (FRONT)
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "3px",
                          textTransform: "capitalize",
                          fontSize: "10px",
                        }}
                        colSpan={4}
                      >
                        PHOTO 2 (BACK)
                      </th>
                    </tr>
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        <img
                          src={dataDetailReportMeasurement?.photo_front}
                          alt="Image Front"
                          style={{
                            width: "190px",
                            height: "190px",
                            margin: "10px",
                            display: "inline-block", // đảm bảo căn giữa trong text-align center
                          }}
                        />
                      </td>

                      <td colSpan={4} style={{ textAlign: "center" }}>
                        <img
                          src={dataDetailReportMeasurement?.photo_back}
                          alt="Image Back"
                          style={{
                            width: "190px",
                            height: "190px",
                            margin: "10px",
                            display: "inline-block", // đảm bảo căn giữa trong text-align center
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFConfirmMeasure;
