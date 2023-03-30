import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-spinners/CircleLoader";
import { fetchUserAction } from "../../redux/slices/usersSlice";
import UsersListHeader from "./UsersListHeader";
import UsersListItem from "./UsersListItem";

const UsersList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserAction());
  }, [dispatch]);

  const allUserList = useSelector((state) => state.users);
  const { userList, appErr, serverErr, loading } = allUserList;
  return (
    <>
      <section className="py-8 bg-gray-900 min-h-screen">
        {loading ? (
          <Loader />
        ) : appErr || serverErr ? (
          <h3>
            {appErr} {serverErr}
          </h3>
        ) : userList?.length <= 0 ? (
          <h2>No user Found</h2>
        ) : (
          userList?.map((user) => (
            <div key={user._id}>
              <UsersListItem user={user} />
            </div>
          ))
        )}
      </section>
    </>
  );
};

export default UsersList;
