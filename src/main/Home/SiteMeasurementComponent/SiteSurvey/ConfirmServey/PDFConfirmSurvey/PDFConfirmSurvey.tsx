import { useQuery } from "@tanstack/react-query";
import { CSSProperties, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { GoDotFill } from "react-icons/go";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import ReactToPrint from "react-to-print";
import logo2 from "../../../../../../assets/images/logo2.png";
import "../../ProjectCodeServey/PDFSummarySurvey/PDFSummarySurvey.css";
import apiAxios from "../../../../../../api/api";
import { api } from "../../../../../service/api/endpoint";

const override: CSSProperties = {
  display: "flex",
  margin: "500px auto",
  borderColor: "red",
};

function PDFConfirmSurvey() {
  const { project_session } = useParams();

  const invoiceContentRef = useRef<any>();
  // const NumberId = Number(id);
  // const fetchDataDetailById = async (idReport: number) => {
  //   try {
  //     const response = await apiAxios.get(api.getDetailSurveyReport(idReport));
  //     return response.data; // { confirm_projects: [], search_options: {} }
  //   } catch (error) {
  //     alert("Something went wrong, please login again!!");
  //     return { error: "Failed to fetch data" };
  //   }
  // };

  // const { data: dataDetailReportSurvey, isLoading: isDataDetailReportSurvey } =
  //   useQuery({
  //     queryKey: ["dataDetailReportSurvey", NumberId],
  //     queryFn: () => fetchDataDetailById(NumberId),
  //     refetchOnWindowFocus: false, // Không gọi lại API khi chuyển tab
  //     enabled: !!NumberId,
  //   });

  const fetchDataSurveyReport = async (session: string) => {
    try {
      const response = await apiAxios.get(
        api.getListSummaryReportSurvey(session)
      );
      return response.data;
    } catch (error) {
      console.error("data survey report summary project session", error);
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response &&
        "data" in (error as any).response
      ) {
        console.error(
          "data survey report detail summary project session",
          (error as any).response.data
        );
      }
      throw error;
    }
  };

  // data dashboard
  const {
    data: dataListSurveySummaryProjectSession,
    isLoading: isLoadingSurveySummaryProjectSession,
  } = useQuery({
    queryKey: ["dataListSurveySummaryProjectSession", project_session],
    queryFn: () => fetchDataSurveyReport(project_session as string),
    enabled: !!project_session,
  });

  if (isLoadingSurveySummaryProjectSession)
    return (
      <FadeLoader
        loading={isLoadingSurveySummaryProjectSession}
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
            documentTitle={`${
              dataListSurveySummaryProjectSession?.list_survey_reports[0]
                ?.project_number
                ? dataListSurveySummaryProjectSession?.list_survey_reports[0]
                    ?.project_number
                : "N/A"
            }
                          - Site Survey -
                          ${
                            dataListSurveySummaryProjectSession
                              ?.list_survey_reports[0]?.project_session
                          }`}
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
        <div id="capture" className="page" ref={invoiceContentRef}>
          {dataListSurveySummaryProjectSession?.list_survey_reports?.map(
            (item: any, index: number) => (
              <div className="page-break" key={index}>
                <div
                  id="capture"
                  className="invoice-container position: relative; border: 2px solid; background-color: #ffffff; overflow: hidden; width: 250mm; min-height: 280mm;  margin: auto; background: white;"
                >
                  <div className="display: flex; align-dataDetailReportSurveys: center; padding: 1px 20px; justify-content: space-around;">
                    <div className="flex gap-[3px]0 justify-between dataDetailReportSurveys-center mt-10 border-b border-solid border-gray-400 pb-3 w-5/6 mx-auto margin-bottom-5">
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

                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                      }}
                    >
                      <colgroup>
                        <col style={{ width: "12.5%" }} />
                        <col style={{ width: "12.5%" }} />
                        <col style={{ width: "12.5%" }} />
                        <col style={{ width: "12.5%" }} />
                        <col style={{ width: "12.5%" }} />
                        <col style={{ width: "12.5%" }} />
                        <col style={{ width: "12.5%" }} />
                        <col style={{ width: "12.5%" }} />
                      </colgroup>

                      <thead>
                        <tr style={{ backgroundColor: "#E5E7EB" }}>
                          <th
                            colSpan={8}
                            style={{
                              textAlign: "center",
                              padding: "8px",
                              fontSize: "16px",
                            }}
                          >
                            DETAIL SURVEY FORM FOR DOOR
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Project Code:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            {item?.project_number
                              ? item?.project_number
                              : "N/A"}
                          </td>

                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Date:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            {item?.date_create}
                          </td>

                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Job Site:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.location}
                          </td>
                        </tr>

                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Customer Name:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            {item?.client_name}
                          </td>

                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Contact:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            {item?.person_contact}
                          </td>

                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Contact:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            {item?.telephone_number}
                          </td>

                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            Survey By:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                          >
                            {item?.created_by}
                          </td>
                        </tr>

                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Site ready for installation:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.site_ready ? "Ready" : "Not Ready"}
                          </td>

                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Survey Reference:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.project_number
                              ? item?.project_number
                              : "N/A"}{" "}
                            - Site Survey - {item?.project_session}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
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
                      <tbody>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Shutter Type:
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.type_of_shutter}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "16px",
                            }}
                            colSpan={4}
                            rowSpan={2}
                          >
                            Site Conditions
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Shutter No:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.shutter_number}
                          </td>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Finishing:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.finishing}
                          </td>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          ></th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            Yes
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            No
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            By/Remarks
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Area In:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.area_in}
                          </td>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Stiffener
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.stiffener ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.stiffener ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.stiffener_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Area Out:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.area_out}
                          </td>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Lintel
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.lintel ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.lintel ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.lintel_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            Installation Position:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.installation_position}
                          </td>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Other
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.other ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.other ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.other_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={4}
                          >
                            Opening size
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={4}
                          >
                            Electrical (applicable to motorised model only)
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            L1 (mm):
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.opening_width}
                          </td>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          ></th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            Yes
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            No
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            By/Remarks
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            H1 (mm):
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                          >
                            {item?.opening_height}
                          </td>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Power
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.power ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.power ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.power_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                            rowSpan={2}
                          >
                            Motor:
                          </th>
                          <td
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                            rowSpan={2}
                          >
                            {item?.motor_side}
                          </td>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Fire alarm
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.fire_alarm ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.fire_alarm ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.fire_alarm_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Other
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.electrical_other ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.electrical_other ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.electrical_other_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "150px",
                            }}
                            colSpan={2}
                            rowSpan={5}
                          >
                            Other Comment
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={2}
                            rowSpan={5}
                          >
                            {item?.other_comment}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={4}
                          >
                            Installation
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          ></th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            Yes
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            No
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            By/Remarks
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Any Obstuction
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.any_obstruction ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.any_obstruction ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.any_obstruction_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "120px",
                            }}
                          >
                            Wall condition ready?
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.wall_condition ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.wall_condition ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.wall_condition_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "100px",
                            }}
                          >
                            Others
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.installation_other ? (
                              <GoDotFill size={16} className="text-black" />
                            ) : (
                              <></>
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                              width: "50px",
                            }}
                          >
                            {item?.installation_other ? (
                              <></>
                            ) : (
                              <GoDotFill size={16} className="text-black" />
                            )}
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                          >
                            {item?.installation_other_remark}
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={4}
                          >
                            PHOTO 1 (FRONT)
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                              padding: "6px",
                              textTransform: "capitalize",
                              fontSize: "12px",
                            }}
                            colSpan={4}
                          >
                            PHOTO 2 (BACK)
                          </th>
                        </tr>
                        <tr>
                          <td colSpan={4} style={{ textAlign: "center" }}>
                            <img
                              src={item?.photo_front}
                              alt="Image Front"
                              style={{
                                width: "190px",
                                height: "190px",
                                margin: "10px",
                                display: "inline-block",
                              }}
                            />
                          </td>
                          <td colSpan={4} style={{ textAlign: "center" }}>
                            <img
                              src={item?.photo_back}
                              alt="Image Back"
                              style={{
                                width: "190px",
                                height: "190px",
                                margin: "10px",
                                display: "inline-block",
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <p className="text-right text-[12px]">
                    {index + 1} /{" "}
                    {
                      dataListSurveySummaryProjectSession?.list_survey_reports
                        ?.length
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default PDFConfirmSurvey;
