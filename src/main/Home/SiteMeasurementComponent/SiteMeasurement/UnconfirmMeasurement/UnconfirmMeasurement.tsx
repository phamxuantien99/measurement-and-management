// ...Các import không đổi
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import apiAxios from "../../../../../api/api";
import { api } from "../../../../service/api/endpoint";
import { useDebounce } from "../../../../service/hooks/useDebounce";
import { Box, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";

// ...headerNew và headerKey không đổi

const headerNew = [
  "Project Code",
  "Client Name",
  "Location",
  "Contact Person",
  "Telephone Number",
  "Date Create",
  "Type Of Shutter",
  "Shutter Number",
  "Opening Length",
  "Opening Height",
];

const headerKey = [
  "project_number",
  "client_name",
  "location",
  "person_contract",
  "telephone_number",
  "date_create",
  "shutter_type",
  "shutter_no",
  "opening_length",
  "opening_height",
];

const fetchDataMeasurementReport = async ({
  pageParam = 1,
  confirm_status = "unconfirmed",
  queryKey,
}: {
  pageParam?: number;
  confirm_status: string;
  queryKey: [string, { search?: string }];
}): Promise<any> => {
  const [_key, { search }] = queryKey;
  const res = await apiAxios.get(
    "https://ec2api.deltatech-backend.com/api/v1/measurement/measurement_report",
    {
      params: {
        page: pageParam,
        confirm_status: confirm_status,
        page_size: 20,

        ...(search ? { filter_by_location_or_project_or_client: search } : {}),
      },
    }
  );
  return res.data;
};

const UnconfirmMeasurement = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchValue = useDebounce(searchQuery, 1000);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchValueChooseProject = useDebounce(inputValue, 1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenPopup = (item: any) => {
    setSelectedId(item);
    setIsOpen(true);
    setSelectedValue("");
    setInputValue("");
  };

  const fetchDataLogistic = async (
    currentPage: number,
    searchValue: string
  ) => {
    const response = await apiAxios.get(
      api.getProjectCode(currentPage, searchValue)
    );
    return response.data;
  };

  const { data: dataProjectCode, isLoading: isLoadingDataProjectCode } =
    useQuery({
      queryKey: ["dataTotalProduct", debouncedSearchValueChooseProject],
      queryFn: () => fetchDataLogistic(1, debouncedSearchValueChooseProject),
      refetchOnWindowFocus: false,
    });

  const isValidProjectCode =
    dataProjectCode?.confirm_projects?.some(
      (project: any) => project.project_number === inputValue
    ) ?? false;

  const handleSubmit = async (project_code: string) => {
    const isValid = dataProjectCode?.confirm_projects?.some(
      (project: any) => project.project_number === project_code
    );

    if (!isValid) {
      alert("Invalid Project Code. Please select a valid one from the list.");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiAxios.put(
        `https://ec2api.deltatech-backend.com/api/v1/measurement/measurement_report/{measurement_report_id}?measurement_request_id=${encodeURIComponent(
          selectedId
        )}&project_code=${encodeURIComponent(project_code)}`,
        {}
      );
      queryClient.invalidateQueries({
        queryKey: ["dataMeasurementReportUnconfirmed"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dataTotalProduct"],
      });
      toast.success("Project code updated successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to update project code.");
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "dataMeasurementReportUnconfirmed",
        { search: debouncedSearchValue },
      ],
      queryFn: fetchDataMeasurementReport,
      getNextPageParam: (lastPage: any) => {
        const { page, page_size, total_count } = lastPage.search_options;
        const totalPages = Math.ceil(total_count / page_size);
        return page < totalPages ? page + 1 : undefined;
      },
    });

  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: document.querySelector("#scrollable-table-container"),
      rootMargin: "0px",
      threshold: 1.0,
    });
    const currentElement = observerRef.current;
    if (currentElement) observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [handleObserver, data]);

  const AllReportMeasurementUnconfirm =
    data?.pages.flatMap((page: any) => page.founds) || [];

  return (
    <div className="p-4 bg-white shadow rounded-md">
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by project code, client name or location..."
          onChange={(event) => handleSearch(event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <Box mt={2}>
        <Typography variant="body2" color="textSecondary">
          <Typography component="span" fontWeight="bold" color="textPrimary">
            Total:
          </Typography>{" "}
          <Typography component="span" color="primary" fontWeight={500}>
            {data?.pages.reduce(
              (acc: any, page: any) => acc + page?.founds?.length,
              0
            )}
          </Typography>{" "}
          /{" "}
          <Typography component="span" color="textPrimary">
            {data?.pages[0]?.search_options.total_count} items
          </Typography>
        </Typography>
      </Box>

      {/* Scrollable table + popup logic */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "84vh" }}
        id="scrollable-table-container"
      >
        <table className="w-full table">
          <thead>
            <tr>
              <th className="text-center">No.</th>
              <th className="text-center">Action</th>
              {headerNew.map((item, index) => (
                <th key={index} className="text-center">
                  {item}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="w-full">
            {!isLoading && AllReportMeasurementUnconfirm?.length === 0 && (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="text-center text-red-600 text-xl"
                >
                  No results
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={headerNew.length + 2} className="text-center">
                  Loading...
                </td>
              </tr>
            )}
            {AllReportMeasurementUnconfirm?.map((item: any, index: number) => {
              const isLastItem =
                index === AllReportMeasurementUnconfirm.length - 1;
              return (
                <tr
                  key={index}
                  className="hover:bg-gray-50"
                  ref={isLastItem ? observerRef : null}
                >
                  <td className="py-2 px-3 border text-center">{index + 1}</td>
                  <td className="py-2 px-3 border">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        to={`/home/pdfUnconfirmMeasure/${item["id"]}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Report"
                      >
                        <BsEyeFill size={16} />
                      </Link>
                      <button
                        onClick={() => handleOpenPopup(item["id"])}
                        className="text-green-600 hover:text-green-800 disabled:opacity-40"
                        title="Updated Project Code"
                      >
                        <FaEdit size={16} />
                      </button>
                    </div>
                  </td>
                  {headerKey.map((key, i) => (
                    <td key={i} className="py-2 px-3 border text-center">
                      {item[key] || "-"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Loading more product  */}
        <div ref={observerRef} style={{ height: 40 }} />
        {isFetchingNextPage && (
          <div style={{ textAlign: "center", padding: 16 }}>
            <CircularProgress size={24} />
          </div>
        )}

        {/* ✅ Popup chọn project code */}
        {isOpen && (
          <div style={styles.overlay}>
            <div style={styles.popup}>
              <h3 style={styles.title}>Select Project Code</h3>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search Project Code..."
                style={styles.input}
              />
              <div style={styles.dropdown}>
                {isLoadingDataProjectCode ? (
                  <p style={styles.loadingText}>Loading...</p>
                ) : (
                  <>
                    {inputValue && isValidProjectCode ? (
                      <div
                        style={{
                          ...styles.dropdownItem,
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        {inputValue}
                      </div>
                    ) : (
                      dataProjectCode?.confirm_projects
                        ?.filter((item: any) =>
                          item.project_number
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        )
                        ?.map((item: any, index: number) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedValue(item.project_number);
                              setInputValue(item.project_number);
                            }}
                            style={{
                              ...styles.dropdownItem,
                              backgroundColor:
                                selectedValue === item.project_number
                                  ? "#f0f0f0"
                                  : "#fff",
                            }}
                          >
                            {item.project_number}
                          </div>
                        ))
                    )}
                  </>
                )}
              </div>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => handleSubmit(inputValue)}
                  style={{
                    ...styles.submitButton,
                    backgroundColor:
                      inputValue === "" || !isValidProjectCode
                        ? "#ccc"
                        : styles.submitButton.backgroundColor,
                    cursor:
                      inputValue === "" || !isValidProjectCode
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={inputValue === "" || !isValidProjectCode}
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={styles.closeButton}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Loading overlay when submitting */}
      {isSubmitting && (
        <div style={styles.fullScreenOverlay}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

// ✅ style object không thay đổi
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    minWidth: 350,
    maxWidth: 500,
    width: "90%",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  title: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 16,
    outline: "none",
  },
  dropdown: {
    maxHeight: 150,
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  dropdownItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  loadingText: {
    textAlign: "center",
    padding: "10px 0",
    color: "#555",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  submitButton: {
    padding: "8px 16px",
    backgroundColor: "#27B770",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
  },
  closeButton: {
    padding: "8px 16px",
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  fullScreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  spinner: {
    width: 60,
    height: 60,
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #27B770",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default UnconfirmMeasurement;
