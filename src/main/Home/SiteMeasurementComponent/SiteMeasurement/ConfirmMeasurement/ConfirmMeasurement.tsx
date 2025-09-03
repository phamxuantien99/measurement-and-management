import { Box, CircularProgress, Typography } from "@mui/material";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import apiAxios from "../../../../../api/api";
import { useDebounce } from "../../../../service/hooks/useDebounce";
import { toast } from "react-toastify";

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
  "Serial Number",
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
  "serial_no",
];

interface ApiResponse {
  founds: any;
  search_options: {
    ordering: string;
    page: number;
    page_size: number;
    total_count: number;
  };
}

const fetchDataMeasurementReport = async ({
  pageParam = 1,
  confirm_status = "confirm",
  queryKey,
}: {
  pageParam?: number;
  confirm_status: string;
  queryKey: [string, { search?: string; filterCheckbox?: boolean | null }];
}): Promise<ApiResponse> => {
  const [_key, { search, filterCheckbox }] = queryKey;
  const res = await apiAxios.get(
    "https://ec2api.deltatech-backend.com/api/v1/measurement/measurement_report",
    {
      params: {
        page: pageParam,
        confirm_status: confirm_status,
        page_size: 20,
        ...(search ? { filter_by_location_or_project_or_client: search } : {}),
        ...(filterCheckbox !== undefined
          ? { filter_by_ticker: filterCheckbox }
          : {}),
      },
    }
  );
  return res.data;
};

const ConfirmMeasurement = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchQuery, 1000);
  const queryClient = useQueryClient();

  // checkbox
  const [checkedItems] = useState([
    { text: "All", value: null },
    { text: "Checked", value: true },
    { text: "Unchecked", value: false },
  ]);

  // state lưu giá trị đang chọn
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleCheck = (value: null | boolean) => {
    setSelected((prev) => (prev === value ? null : value));
    // nếu click lại thì bỏ chọn (null), còn nếu click khác thì chuyển qua cái khác
  };

  const handleSearch = (value: string) => setSearchQuery(value);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "dataMeasurementReportConfirm",
        { search: debouncedSearchValue, filterCheckbox: selected },
      ],
      queryFn: fetchDataMeasurementReport,
      getNextPageParam: (lastPage: ApiResponse) => {
        const { page, page_size, total_count } = lastPage.search_options;
        const totalPages = Math.ceil(total_count / page_size);
        return page < totalPages ? page + 1 : undefined;
      },
    });

  const observerRef = useRef<HTMLTableRowElement | null>(null);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleOpenPopup = (item: any) => {
    setSelectedItem(item);
    setIsOpen(true);
    setInputValue("");
  };
  const handleSubmit = async (serial_number: string) => {
    try {
      setIsSubmitting(true);
      await apiAxios.put(
        `https://ec2api.deltatech-backend.com/api/v1/measurement/measurement_report_serial/{measurement_report_id}?measurement_request_id=${selectedItem}&serial_number=${serial_number}`,
        {}
      );
      queryClient.invalidateQueries({
        queryKey: ["dataMeasurementReportConfirm"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dataListSummaryMeasurement"],
      });
      setIsOpen(false);
      toast.success("Serial number updated successfully.");
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        toast.error("Serial number already exists.");
      } else {
        toast.error("Error updating serial number.");
        console.error("Error fetching data:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = async (id: number) => {
    try {
      setIsSubmitting(true);
      await apiAxios.put(
        `https://ec2api.deltatech-backend.com/api/v1/measurement/measurement_report_ticker/{measurement_report_id}?measurement_request_id=${id}`,
        {}
      );
      queryClient.invalidateQueries({
        queryKey: ["dataMeasurementReportConfirm"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dataListSummaryMeasurement"],
      });
      setIsOpen(false);
      toast.success("Updated successfully.");
    } catch (error: any) {
      toast.error("Error updating measurement report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const AllReportMeasurementConfirm =
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
            {AllReportMeasurementConfirm.length}
          </Typography>{" "}
          /{" "}
          <Typography component="span" color="textPrimary">
            {data?.pages[0]?.search_options.total_count || 0} items
          </Typography>
        </Typography>
      </Box>

      {/* Scrollable table */}
      <div
        id="scrollable-table-container"
        className="overflow-y-auto"
        style={{ maxHeight: "75vh" }}
      >
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-3 border">
                <div className="flex flex-col gap-1">
                  {checkedItems.map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selected === item.value}
                        onChange={() => handleCheck(item.value)}
                        className="form-checkbox cursor-pointer"
                      />
                      <span>{item.text}</span>
                    </label>
                  ))}
                </div>
              </th>

              <th className="py-2 px-3 border">No.</th>
              <th className="py-2 px-3 border text-center">Action</th>
              {headerNew.map((header, idx) => (
                <th key={idx} className="py-2 px-3 border text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && AllReportMeasurementConfirm.length === 0 && (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-red-500 font-medium"
                >
                  No results found
                </td>
              </tr>
            )}

            {AllReportMeasurementConfirm.map((item: any, index: number) => {
              const isLastItem =
                index === AllReportMeasurementConfirm.length - 1;
              return (
                <tr
                  key={item.id || index}
                  ref={isLastItem ? observerRef : null}
                  className="hover:bg-gray-50"
                >
                  <td className="py-2 px-3 border text-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.ticker}
                      className="cursor-pointer"
                      disabled={item?.ticker === "T"}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>

                  <td className="py-2 px-3 border text-center">{index + 1}</td>
                  <td className="py-2 px-3 border">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        to={`/home/pdfConfirmMeasure/${item.id}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Report"
                      >
                        <BsEyeFill size={16} />
                      </Link>
                      <button
                        onClick={() => handleOpenPopup(item.id)}
                        className="text-green-600 hover:text-green-800 disabled:opacity-40"
                        disabled={item.serial_no !== ""}
                        title="Assign Serial No."
                      >
                        <IoMdAddCircleOutline size={16} />
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
      </div>

      {/* Loading more data */}
      {isFetchingNextPage && (
        <div style={{ textAlign: "center", padding: 16 }}>
          <CircularProgress size={24} />
        </div>
      )}

      {/* Popup for serial number */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Enter Serial Number</h2>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter serial number..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(inputValue)}
                disabled={inputValue === ""}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default ConfirmMeasurement;
