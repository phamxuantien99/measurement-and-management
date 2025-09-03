import { Box, CircularProgress, Typography } from "@mui/material";
import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import apiAxios from "../../../../../api/api";
import { useDebounce } from "../../../../service/hooks/useDebounce";

const headerNew = [
  "Project Code",
  "Client Name",
  "Location",
  "Person Contact",
  "Telephone Number",
];

const headerKey = [
  "project_number",
  "client_name",
  "location",
  "person_contract",
  "telephone_number",
];

// const fetchDataProjectCode = async ({
//   pageParam = 1,
//   queryKey,
// }: QueryFunctionContext<
//   [string, { search?: string }],
//   number
// >): Promise<ApiResponse> => {
//   const [_key, { search }] = queryKey;
//   const res = await apiAxios.get(
//     "https://ec2api.deltatech-backend.com/api/v1/measurement/projects_that_have_survey_report",
//     {
//       params: {
//         page: pageParam,
//         page_size: 20,
//         ...(search ? { filter_by_location_or_project_or_client: search } : {}),
//       },
//     }
//   );
//   return res.data;
// };

type ProjectCodeQueryKey = [string, { search?: string }];

const fetchDataProjectCode = async ({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext<ProjectCodeQueryKey, number>): Promise<any> => {
  const [_key, { search }] = queryKey;

  const res = await apiAxios.get(
    "https://ec2api.deltatech-backend.com/api/v1/measurement/projects_that_have_survey_report",
    {
      params: {
        page: pageParam,
        page_size: 20,
        ...(search ? { filter_by_location_or_project_or_client: search } : {}),
      },
    }
  );

  return res.data;
};

const ProjectCodeServey = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchValue = useDebounce(searchQuery, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<
      any, // Dữ liệu mỗi page
      Error, // Kiểu lỗi
      any, // Dữ liệu sau select (nếu không dùng thì giống dòng 1)
      ProjectCodeQueryKey, // Kiểu của queryKey
      number // Kiểu của pageParam
    >({
      queryKey: ["dataTotalProduct", { search: debouncedSearchValue }],
      queryFn: fetchDataProjectCode,
      getNextPageParam: (lastPage) => {
        const { page, page_size, total_count } = lastPage.search_options;
        const totalPages = Math.ceil(total_count / page_size);
        return page < totalPages ? page + 1 : undefined;
      },
      initialPageParam: 1,
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };
  const projects =
    data?.pages.flatMap((page: any) => page.confirm_projects) || [];

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by client, location, etc."
          value={searchQuery}
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
              (acc: any, page: any) => acc + page?.confirm_projects?.length,
              0
            )}
          </Typography>{" "}
          /{" "}
          <Typography component="span" color="textPrimary">
            {data?.pages[0]?.search_options.total_count} users
          </Typography>
        </Typography>
      </Box>

      <div
        className="overflow-y-auto"
        style={{ maxHeight: "75vh" }}
        id="scrollable-table-container"
      >
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-3 border text-center">No.</th>
              <th className="py-2 px-3 border text-center">Action</th>
              {headerNew.map((item, index) => (
                <th key={index} className="py-2 px-3 border">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-red-500 font-medium"
                >
                  No results found
                </td>
              </tr>
            ) : (
              projects.map((item: any, index: number) => {
                const isLast = index === projects.length - 1;
                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50"
                    ref={isLast ? observerRef : null}
                  >
                    <td className="py-2 px-3 border text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3 border">
                      <div className="flex justify-center items-center">
                        <Link
                          to={`/home/pdfSummarySurvey/${item["project_number"]}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Survey"
                        >
                          <BsEyeFill size={16} />
                        </Link>
                      </div>
                    </td>
                    {headerKey.map((key, index) => (
                      <td key={index} className="py-2 px-3 border">
                        {item[key] || "-"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <tr ref={observerRef} style={{ height: 40 }} />
        {isFetchingNextPage && (
          <div style={{ textAlign: "center", padding: 16 }}>
            <CircularProgress size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCodeServey;
