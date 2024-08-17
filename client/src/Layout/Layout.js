import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiFillCloseCircle,AiFillHome  } from "react-icons/ai";
import { SiGnuprivacyguard } from "react-icons/si";
import { IoBook ,IoLogOut } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { RiDashboardFill } from "react-icons/ri";
import { RiContactsFill } from "react-icons/ri";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hidden,setHidden]=useState(false)
  // for checking user logged in or not
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  // for dispaying the options, according to user role
  const role = useSelector((state) => state?.auth?.role);

  // function to hide the drawer on close button click
  const hideDrawer = () => {
    setHidden(false)
    const element = document.getElementsByClassName("drawer-toggle");
    element[0].checked = false;

    // collapsing the drawer-side width to zero
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = 0;
  };

  // function for changing the drawer width on menu button click
  const changeWidth = () => {
    setHidden(true)
    const drawerSide = document.getElementsByClassName("drawer-side");
    drawerSide[0].style.width = "auto";
  };

  // function to handle logout
  const handleLogout = async (event) => {
    event.preventDefault();

    // calling logout action
    const res = await dispatch(logout());

    // redirect to home page if true
    if (res?.payload?.success) navigate("/");
  };

  return (
    <div className="min-h-[90vh]">
      {/* adding the daisy ui drawer */}
      <div className="drawer absolute z-50 left-0 w-fit">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content overflow-hidden">
          <label htmlFor="my-drawer" className="w-fit">
            <FiMenu
              hidden={hidden}
              onClick={changeWidth}
              size={"40px"}
              className="font-bold text-black w-full m-2 hover:cursor-pointer"
            />
          </label>
        </div>

        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-48 sm:w-80 bg-base-700 text-white relative">
            {/* close button for drawer */}
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>

            <li className="hover:bg-white hover:text-black transition ease-out duration-75 rounded-lg size-4/5">
              <Link to={"/"}><AiFillHome />Home</Link>
            </li>

            {/* displaying dashboard, if user is logged in */}
            {isLoggedIn && role === "ADMIN" && (
              <li className="hover:bg-white hover:text-black transition ease-out duration-75 rounded-lg">
                <Link to={"/admin/dashboard"}><RiDashboardFill/>Admin Dashboard</Link>
              </li>
            )}

            <li className="hover:bg-white hover:text-black transition ease-out duration-75 rounded-lg">
              <Link to={"/courses"}><IoBook/>All Courses</Link>
            </li>

            <li className="hover:bg-white hover:text-black transition ease-out duration-75 rounded-lg">
              <Link to={"/contact"}><RiContactsFill/>Contact Us</Link>
            </li>

            <li className="hover:bg-white hover:text-black transition ease-out duration-75 rounded-lg">
              <Link to={"/about"}><BsFillInfoSquareFill/>About Us</Link>
            </li>

            {/* creating the bottom part of drawer */}
            {/* if user is not logged in */}
            {!isLoggedIn && (
              <li className="absolute bottom-4 w-[90%] bg-white text-black">
                <div className="w-full flex cursor-default">
                  <div className="flex  items-center ml-5">
                    <div><Link to={"/login"}><TbLogout size={24} /></Link></div>
                      <button className="font-semibold rounded-md">
                        <Link to={"/login"}>Login</Link>
                      </button>
                    </div>  
                    <div className="flex  items-center ml-20">
                    <div><Link to={"/signup"}><SiGnuprivacyguard size={20}/></Link></div>
                    <button className="font-semibold rounded-md ">
                    <Link to={"/signup"}>Signup</Link>
                  </button>
                  </div>
                </div>
              </li>
            )}

            {/* if user is logged in */}
            {isLoggedIn && (
              <li className="absolute bottom-4 w-[90%] bg-white text-black">
                <div className="w-full flex cursor-default">
                  <div className="flex  items-center ml-5">
                    <div><Link to={"/user/profile"}><CgProfile size={24}/></Link></div>
                    <button className="font-semibold rounded-md">
                      <Link to={"/user/profile"}>Profile</Link>
                    </button>
                  </div>
                  <div className="flex  items-center ml-20">
                  <div><Link onClick={handleLogout}><TbLogout size={24}/></Link></div>
                    <button className="font-semibold rounded-md ">
                      <Link onClick={handleLogout}>Logout</Link>
                    </button>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>

      {children}

      {/* adding the footer content */}
      <Footer />
    </div>
  );
};

export default Layout;
