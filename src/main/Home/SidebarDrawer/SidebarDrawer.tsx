import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { useNavigate } from "react-router-dom";
import { useSupervisor } from "../../context/SupervisorContext";

const SidebarDrawer: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isSupervisor } = useSupervisor(); // 👈 lấy giá trị true/false

  const toggleDrawer = (state: boolean) => () => {
    setOpen(state);
  };

  const menuItems = [
    { text: "Site Measurement", icon: <InfoIcon />, path: "/SiteMeasurement" },
    { text: "Installer", icon: <ContactMailIcon />, path: "/Installer" },
    // Admin chỉ add nếu isSupervisor = true
    ...(isSupervisor
      ? [{ text: "Admin", icon: <HomeIcon />, path: "/Admin" }]
      : []),
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        className="fixed left-4 z-50 bg-white shadow-lg hover:bg-gray-100 transition-colors duration-300 p-2 rounded-full"
        size="large"
      >
        <MenuIcon className="text-gray-700" />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <div className="w-64 h-full bg-white shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          </div>
          <List className="mt-2">
            {menuItems.map(({ text, icon, path }) => (
              <ListItem
                component="button"
                key={text}
                onClick={() => handleNavigate(path)}
                className="hover:bg-gray-100 px-4 py-3 transition-colors duration-200 cursor-pointer"
              >
                <ListItemIcon className="min-w-[32px] text-gray-600">
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    className: "text-gray-800 font-medium",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default SidebarDrawer;
