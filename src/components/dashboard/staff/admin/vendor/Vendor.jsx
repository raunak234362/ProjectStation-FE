/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCloseCircle } from "react-icons/io";
import { NavLink, Outlet } from "react-router-dom";
import Service from "../../../../../config/Service";
import { useDispatch, useSelector } from "react-redux";
import { loadVendor, loadVendorUser } from "../../../../../store/vendorSlice";

const Vendor = () => {
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const vendors = useSelector((state) => state?.vendorData?.vendorData);
  const vendorUsers = useSelector((state) => state?.vendorData?.vendorUserData);

  // const fetchAllVendors = async () => {
  //   const vendorsData = await Service.allVendor(token);
  //   dispatch(loadVendor(vendorsData));
  // };

  // const fetchVendorUsers = async () => {
  //   const vendorUserData = await Service.allVendorUser(token);
  //   dispatch(loadVendorUser(vendorUserData));
  //   console.log(vendorUserData);
  // };

  // useEffect(() => {
  //   fetchVendorUsers();
  //   fetchAllVendors();
  // }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full h-[89vh] overflow-y-hidden mx-5">
      <div className="flex w-full justify-center items-center">
        <div className="text-3xl font-bold text-white bg-teal-500/50 shadow-xl px-5 py-1 mt-2 rounded-lg">
          Vendors
        </div>
      </div>
      <div className="h-[85vh] mt-2 overflow-y-auto">
        <div className="my-5 grid md:grid-cols-3 grid-cols-2 gap-5 ">
          <div className="flex flex-col justify-center items-center bg-white/50 rounded-lg p-3 shadow-lg">
            <div className="font-bold text-xl text-gray-800">Total Vendors</div>
            <div className="text-3xl font-bold">{vendors.length}</div>
          </div>
          <div className="flex flex-col justify-center items-center bg-white/50 rounded-lg p-3 shadow-lg">
            <div className="font-bold text-xl text-gray-800">
              No. of Vendors users
            </div>
            <div className="text-3xl font-bold">{vendorUsers.length}</div>
          </div>
        </div>

        <div className={` rounded-lg bg-white md:text-lg text-sm`}>
          <div className="overflow-auto bg-teal-100 rounded-lg md:w-full w-[90vw]">
            <nav className="px-5 drop-shadow-md text-center">
              <ul className=" flex justify-evenly items-center gap-5 py-1 text-center">
                <li className="px-2">
                  <NavLink
                    to="add-vendor"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    Add Vendor
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="all-vendors"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All Vendors
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="add-vendor-user"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    Add Vendor User
                  </NavLink>
                </li>
                <li className="px-2">
                  <NavLink
                    to="all-vendor-user"
                    className={({ isActive }) =>
                      isActive
                        ? "bg-teal-300 drop-shadow-lg flex px-5 py-2 rounded-lg font-semibold"
                        : "hover:bg-teal-200 rounded-lg flex px-5 py-2 hover:text-white"
                    }
                  >
                    All Vendor Users
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Vendor;
