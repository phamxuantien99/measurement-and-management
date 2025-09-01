// components/Header.tsx
import React from "react";
import SidebarDrawer from "../SidebarDrawer/SidebarDrawer";
import LogoutBtn from "../Logout/LogoutBtn";
import logoImage from "../../../assets/images/logo1.png"; // Adjust the path as necessary
import { SupervisorProvider } from "../../context/SupervisorContext";

const HeaderComponent: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-full py-3 flex items-center justify-around">
        <SupervisorProvider>
          <SidebarDrawer />
        </SupervisorProvider>
        <img
          src={logoImage}
          alt="logo"
          style={{
            width: 400,
            height: "auto", // giữ nguyên tỷ lệ
            objectFit: "contain", // đảm bảo không bị méo
            display: "block",
            // canh giữa và tạo khoảng cách trên/dưới
          }}
        />
        <LogoutBtn />
      </div>
    </header>
  );
};

export default HeaderComponent;
