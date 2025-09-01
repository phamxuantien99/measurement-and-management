import React, { CSSProperties, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import withAuth from "./main/com/RequiredAuth";
import HeaderComponent from "./main/Home/HeaderComponent/HeaderComponent";

const AdminComponent = React.lazy(
  () => import("./main/Home/AdminComponent/AdminComponent")
);

const GroupPermission = React.lazy(
  () => import("./main/Home/AdminComponent/GroupPermission/GroupPermission")
);

const GetListPermissions = React.lazy(
  () =>
    import("./main/Home/AdminComponent/GetListPermissions/GetListPermissions")
);
// SiteMeasurementComponent is a lazy-loaded component
const SiteMeasurementComponent = React.lazy(
  () => import("./main/Home/SiteMeasurementComponent/SiteMeasurementComponent")
);

const PDFConfirmMeasure = React.lazy(
  () =>
    import(
      "./main/Home/SiteMeasurementComponent/SiteMeasurement/ConfirmMeasurement/PDFConfirmMeasure/PDFConfirmMeasure"
    )
);

const PDFUnconfirmMeasure = React.lazy(
  () =>
    import(
      "./main/Home/SiteMeasurementComponent/SiteMeasurement/UnconfirmMeasurement/PDFUncofirmMeasure/PDFUncofirmMeasure"
    )
);

const FormSummaryPOMeasure = React.lazy(
  () =>
    import(
      "./main/Home/SiteMeasurementComponent/SiteMeasurement/ProjectCodeMeasurement/FormSummaryPOMeasure/FormSummaryPOMeasure"
    )
);

const PDFSummarySurvey = React.lazy(
  () =>
    import(
      "./main/Home/SiteMeasurementComponent/SiteSurvey/ProjectCodeServey/PDFSummarySurvey/PDFSummarySurvey"
    )
);

const PDFConfirmSurvey = React.lazy(
  () =>
    import(
      "./main/Home/SiteMeasurementComponent/SiteSurvey/ConfirmServey/PDFConfirmSurvey/PDFConfirmSurvey"
    )
);

// installerComponent is a lazy-loaded component
const InstallerComponent = React.lazy(
  () => import("./main/Home/InstallerComponent/InstallerComponent")
);
const Login = React.lazy(() => import("./main/Login/Login"));

const override: CSSProperties = {
  display: "flex",
  margin: "500px auto",
  borderColor: "red",
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token_installation");
    const expiration = localStorage.getItem("expiration_installation");

    if (
      token &&
      expiration &&
      new Date(expiration) > new Date() &&
      location.pathname === "/"
    ) {
      navigate("/SiteMeasurement");
    }
  }, [navigate, location.pathname]);

  // const ProtectedHome = withAuth(Home);
  const ProtectedAdmin = withAuth(AdminComponent);
  const ProtectedGroupPermission = withAuth(GroupPermission);
  const ProtectedGetListPermissions = withAuth(GetListPermissions);
  const ProtectedSiteMeasurement = withAuth(SiteMeasurementComponent);
  const ProtectedInstaller = withAuth(InstallerComponent);
  const ProtectedFormSummaryPOMeasure = withAuth(FormSummaryPOMeasure);
  const ProtectedPDFConfirmMeasure = withAuth(PDFConfirmMeasure);
  const ProtectedPDFUnconfirmMeasure = withAuth(PDFUnconfirmMeasure);
  const ProtectedPDFSummarySurvey = withAuth(PDFSummarySurvey);
  const ProtectedPDFConfirmSurvey = withAuth(PDFConfirmSurvey);

  return (
    <>
      {location.pathname !== "/" && <HeaderComponent />}

      <Suspense
        fallback={
          <div>
            <FadeLoader
              cssOverride={override}
              color="red"
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        }
      >
        <div className={location.pathname !== "/" ? "pt-32" : ""}>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* <Route path="/home" element={<ProtectedHome />} /> */}
            {/* Admin */}

            {/* Admin routes chỉ render nếu có userInfo */}

            <>
              <Route path="/Admin" element={<ProtectedAdmin />} />
              <Route
                path="/Admin/groupPermission"
                element={<ProtectedGroupPermission />}
              />
              <Route
                path="/Admin/getListPermissions"
                element={<ProtectedGetListPermissions />}
              />
            </>

            {/* <Route path="/Admin" element={<ProtectedAdmin />} />

            <Route
              path="/Admin/groupPermission"
              element={<ProtectedGroupPermission />}
            />
            <Route
              path="/Admin/getListPermissions"
              element={<ProtectedGetListPermissions />}
            /> */}
            {/* Site Measurement */}
            <Route
              path="/SiteMeasurement"
              element={<ProtectedSiteMeasurement />}
            />
            <Route
              path="/home/formSummary/:project_number"
              element={<ProtectedFormSummaryPOMeasure />}
            />
            <Route
              path="/home/pdfConfirmMeasure/:id"
              element={<ProtectedPDFConfirmMeasure />}
            />
            <Route
              path="/home/pdfUnconfirmMeasure/:id"
              element={<ProtectedPDFUnconfirmMeasure />}
            />

            <Route
              path="/home/pdfSummarySurvey/:project_number"
              element={<ProtectedPDFSummarySurvey />}
            />
            <Route
              path="/home/pdfConfirmSurvey/:project_session"
              element={<ProtectedPDFConfirmSurvey />}
            />
            {/* Installer */}
            <Route path="/Installer" element={<ProtectedInstaller />} />
          </Routes>
        </div>

        <ToastContainer position="top-right" autoClose={3000} />
      </Suspense>
    </>
  );
}

export default App;
