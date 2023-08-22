import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  // logout funtion
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  // =========== mentor menu ===============
  const mentorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/mentor-appointments",
      icon: "fa-solid fa-list",
    },

    {
        //path is here dynamic
      name: "Profile",
      path: `/userprofile`,
      icon: "fa-solid fa-user",
    },
  ];
  // =========== mentor menu ===============

  // redering menu list

  //if user is admin show admin sidebar else if user if mentor then show mentor sidebar else show user sidebar
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isMentor
    ? mentorMenu
    : userMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo flex items-center justify-center h-[8vh] mb-8">

                <img src="newlogo.png" className="w-[55px]" />
                <div className="text-center justify-center flex ml-2 font-bold text-2xl logohead text-white">SOLVE MY DOUBT</div>
            </div>
            <div className="flex justify-center">
              <div className="menu w-[90%]">
                {SidebarMenu.map((menu) => {
                  const isActive = location.pathname === menu.path;
                  return (
                    <>
                      <Link to={menu.path}>
                        <div className={`menu-item ${isActive && "active"}`}>
                          <i className={menu.icon}></i>
                          {menu.name}
                        </div>
                      </Link>
                    </>
                  );
                })}
                <Link to="/login">
                  <div className={`menu-item `} onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </div>
                </Link>
              </div>
            </div>
            
          </div>
          <div className="content">
            <div className="header items-center flex">
              <div className="header-content w-full">
                <div className="items-center p-1 pt-2 cursor-pointer px-2 rounded-md hover:bg-gray-200">
                <Badge
                  count={user && user.notification.length}
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i class="fa-solid fa-bell"></i>
                </Badge></div>

                <Link to="/profile" className="font-bold mx-4 text-black lowercase">{user?.name}</Link>
                <img src="profile.png" className="w-[45px] drop-shadow-md mr-4" />
              </div>
            </div>
            <div className="body">
              <div className="flex h-full">
                <div className="h-full w-full rounded-md bg-white shadow-sm p-3">{children}</div> 
              </div>
            </div>
              
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
