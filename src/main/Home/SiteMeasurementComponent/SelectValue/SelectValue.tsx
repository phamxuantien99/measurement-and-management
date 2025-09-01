import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";

export default function SelectValue() {
  const { selectSite, setSelectSite } = useContext(
    AuthContext
  ) as AuthContextType;

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white shadow-md rounded-lg w-fit">
      <label
        htmlFor="site-select"
        className="text-sm font-medium text-gray-700"
      >
        Select Type:
      </label>
      <select
        id="site-select"
        className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer
        ${selectSite ? "bg-green-600 text-white" : "bg-white text-gray-700"}
      `}
        value={selectSite}
        onChange={(e) => setSelectSite(e.target.value)}
      >
        <option value="Site Measurement">Site Measurement</option>
        <option value="Site Survey">Site Survey</option>
      </select>
    </div>
  );
}
