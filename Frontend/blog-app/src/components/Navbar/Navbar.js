import React from "react";
import AdminNavbar from "./admin/AdminNavbar";
import PrivateNavbar from "./private/PrivateNavbar";
import PublicNavbar from "./public/PublicNavbar";
import { useSelector } from "react-redux";
import AccountVerificationAlertWarning from "./Alerts/AccountVerificationAlertWarning";
import AccountVerificationSuccessAlert from "./Alerts/AccountVerificationSuccessAlert";
import Loader from "react-spinners/CircleLoader";

const Navbar = () => {
  //get data from store

  const user = useSelector((state) => state.users);
  const { userAuth } = user;

  const accountVer = useSelector((state) => state.accountToken);
  const { verificationToken, loading, appErr, serverErr } = accountVer;

  const isAdmin = userAuth?.isAdmin;
  return (
    <>
      {isAdmin ? (
        <AdminNavbar isLogin={userAuth} />
      ) : userAuth ? (
        <PrivateNavbar isLogin={userAuth} />
      ) : (
        <PublicNavbar />
      )}
      {userAuth && !userAuth.isVerified && <AccountVerificationAlertWarning />}
      {loading && <Loader />}
      {verificationToken && <AccountVerificationSuccessAlert />}
      {appErr || serverErr ? (
        <h2 className="text-center text-red-500">
          {serverErr} {appErr}
        </h2>
      ) : null}
    </>
  );
};

export default Navbar;
