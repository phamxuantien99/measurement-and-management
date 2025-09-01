import { Box, CircularProgress, Typography } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import apiAxios from "../../../../../api/api";
import { useDebounce } from "../../../../service/hooks/useDebounce";

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
  "contact_person",
  "telephone_number",
  "date_create",
  "shutter_type",
  "shutter_no",
  "opening_length",
  "opening_height",
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

const fetchDataSurveyReport = async ({
  pageParam = 1,
  confirm_status = "unconfirmed",
  queryKey,
}: {
  pageParam?: number;
  confirm_status: string;
  queryKey: [string, { search?: string }];
}): Promise<ApiResponse> => {
  const [_key, { search }] = queryKey;
  const res = await apiAxios.get(
    "https://ec2api.deltatech-backend.com/api/v1/measurement/survey_reports",
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

const UnconfirmServey = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchQuery, 1000);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<ApiResponse, Error>({
      queryKey: ["dataSurveyReportUnconfirm", { search: debouncedSearchValue }],
      queryFn: fetchDataSurveyReport,
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

  const AllReportSurveyUnconfirm =
    data?.pages.flatMap((page) => page.founds) || [];

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
            {data?.pages.reduce((acc, page) => acc + page?.founds?.length, 0)}
          </Typography>{" "}
          /{" "}
          <Typography component="span" color="textPrimary">
            {data?.pages[0]?.search_options.total_count} items
          </Typography>
        </Typography>
      </Box>

      {/* Scrollable table */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "75vh" }}
        id="scrollable-table-container"
      >
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
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
            {!isLoading && AllReportSurveyUnconfirm?.length === 0 && (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-red-500 font-medium"
                >
                  No results found
                </td>
              </tr>
            )}
            {AllReportSurveyUnconfirm?.map((item: any, index: number) => {
              const isLastItem = index === AllReportSurveyUnconfirm.length - 1;
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
                        to={`/home/pdfConfirmSurvey/${item["project_session"]}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Report"
                      >
                        <BsEyeFill size={16} />
                      </Link>
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

      {/* Loading more product  */}
      {/* The observerRef is now attached to the last <tr>, so this div is not needed */}
      {isFetchingNextPage && (
        <div style={{ textAlign: "center", padding: 16 }}>
          <CircularProgress size={24} />
        </div>
      )}
    </div>
  );
};

export default UnconfirmServey;
