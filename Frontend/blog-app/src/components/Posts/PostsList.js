import { ThumbUpIcon, ThumbDownIcon, EyeIcon } from "@heroicons/react/solid";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllPostAction,
  toggleDislikeAction,
  toggleLikeAction,
} from "../../redux/slices/postsSlice";
import { useDispatch, useSelector } from "react-redux";
import DateFormatter from "../../utils/DateFormatter";
import { fetchAllCategory } from "../../redux/slices/categorySlice";
import Loader from "react-spinners/CircleLoader";
import { useState } from "react";

export default function PostsList() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post);
  const [query, setQuery] = useState("");
  const [filteredItem, setFilteredItem] = [];

  const { postList, appErr, serverErr, likesList, disLikesList } = post;

  const category = useSelector((state) => state.category);
  const {
    categoryList,
    loading: categoryLoading,
    appErr: categoryappErr,
    serverErr: categoryServerErr,
  } = category;

  useEffect(() => {
    dispatch(fetchAllPostAction(""));
  }, [dispatch, likesList, disLikesList]);

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  // useEffect(() => {
  //   searchItem();
  // }, []);

  // const searchItem = () => {
  //   filteredItem = postList?.filter((post) => {
  //     console.log(post?.title, "postList2");
  //     return post.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  //   });
  // };

  return (
    <>
      <section>
        <div className="py-20 bg-gray-400 min-h-screen radius-for-skewed">
          <div className="container mx-auto px-4">
            <div className="mb-16 flex flex-wrap items-center">
              <div className="w-full lg:w-2/3">
                <span className="text-white text-3xl font-bolder">
                  Latest Posts from our awesome authors
                </span>
                <h2 className="text-6xl text-gray-900 lg:text-5xl font-bold font-heading">
                  Latest Post
                </h2>
              </div>
              <div className=" block text-right w-1/3">
                {/* View All */}
                <button
                  onClick={() => dispatch(fetchAllPostAction(""))}
                  className="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-blue-600 hover:bg-blue-800 text-gray-50 font-bold leading-loose transition duration-200"
                >
                  View All Posts
                </button>
              </div>
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="mb-8 lg:mb-0 w-full lg:w-1/4 px-3">
                <div className="py-4 px-6 bg-gray-600 shadow rounded">
                  <h4 className="mb-4 text-gray-500 font-bold uppercase">
                    Categories
                  </h4>
                  <ul>
                    {categoryLoading ? (
                      <Loader />
                    ) : categoryServerErr || categoryappErr ? (
                      <h1>
                        {categoryappErr} {categoryServerErr}
                      </h1>
                    ) : categoryList?.length <= 0 ? (
                      <h1 className="text-yellow-400 text-lg text-center">
                        No Category Found
                      </h1>
                    ) : (
                      categoryList?.map((cat) => (
                        <li key={cat?._id}>
                          <p
                            onClick={() =>
                              dispatch(fetchAllPostAction(cat?.title))
                            }
                            className="block cursor-pointer py-2 px-3 mb-4 rounded text-yellow-500 font-bold bg-gray-500"
                          >
                            {cat?.title}
                          </p>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
              <div className="w-full lg:w-3/4 px-3">
                {appErr || serverErr ? (
                  <h1 className="text-yellow-600 text-center text-lg">
                    {appErr} {serverErr}
                  </h1>
                ) : postList?.length <= 0 ? (
                  <h1 className="text-yellow-400 text-lg text-center">
                    No Posts found
                  </h1>
                ) : (
                  postList?.map((post) => (
                    <div
                      className="flex flex-wrap bg-gray-100 -mx-3  lg:mb-6"
                      key={post?._id}
                    >
                      <div className="mb-10 pl-0  w-full lg:w-1/4 ">
                        <Link to="#">
                          {/* Post image */}
                          <img
                            className="w-full h-full object-cover rounded"
                            src={post.image}
                            alt=""
                          />
                        </Link>
                        {/* Likes, views dislikes */}
                        <div className="flex flex-row bg-gray-300 justify-center w-full  items-center ">
                          {/* Likes */}
                          <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            {/* Togle like  */}
                            <div className="">
                              <ThumbUpIcon
                                onClick={() =>
                                  dispatch(toggleLikeAction(post?._id))
                                }
                                className="h-7 w-7 text-indigo-600 cursor-pointer"
                              />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.likes?.length ? post?.likes?.length : 0}
                            </div>
                          </div>
                          {/* Dislike */}
                          <div className="flex flex-row  justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            <div>
                              <ThumbDownIcon
                                onClick={() =>
                                  dispatch(toggleDislikeAction(post?._id))
                                }
                                className="h-7 w-7 cursor-pointer text-gray-600"
                              />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.disLikes?.length
                                ? post?.disLikes?.length
                                : 0}
                            </div>
                          </div>
                          {/* Views */}
                          <div className="flex flex-row justify-center items-center ml-4 mr-4 pb-2 pt-1">
                            <div>
                              <EyeIcon className="h-7 w-7  text-gray-400" />
                            </div>
                            <div className="pl-2 text-gray-600">
                              {post?.numViews ? post?.numViews : 0}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-2/4 px-3">
                        <Link to="#" className="hover:underline">
                          <h3
                            style={{ marginTop: "1rem" }}
                            className="mb-1  text-4xl text-gray-900 font-bold font-heading"
                          >
                            {post?.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600">{post?.description}</p>

                        <Link
                          to={`/posts/${post?._id}`}
                          className="text-indigo-700 hover:underline"
                        >
                          Read the Full Post...
                        </Link>
                        {/* User Avatar */}
                        <div className="mt-6 flex items-center">
                          <div className="flex-shrink-0">
                            <Link to="#">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={post?.user?.profilePhoto}
                                alt=""
                              />
                            </Link>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              <Link
                                to={`/profile/${post?.user?._id}`}
                                className="text-yellow-500 hover:underline "
                              >
                                {post?.user?.firstName} {post?.user?.lastName}
                              </Link>
                            </p>
                            <div className="flex space-x-1 text-sm text-green-500">
                              <time>
                                <DateFormatter date={post?.createdAt} />
                              </time>
                              <span aria-hidden="true">&middot;</span>
                            </div>
                          </div>
                        </div>
                        {/* <p className="text-gray-500">
                          Quisque id sagittis turpis. Nulla sollicitudin rutrum
                          eros eu dictum...
                        </p> */}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900">
          <div className="skew bg-green-500 skew-bottom mr-for-radius">
            <svg
              className="h-8 md:h-12 lg:h-10 w-full text-gray-900"
              viewBox="0 0 10 10"
              preserveAspectRatio="none"
            >
              <polygon fill="currentColor" points="0 0 10 0 0 10"></polygon>
            </svg>
          </div>
          <div className="skew bg-gray-500  skew-bottom ml-for-radius">
            <svg
              className="h-8 bg-gray-500 md:h-12 lg:h-20 w-full text-gray-900"
              viewBox="0 0 10 10"
              preserveAspectRatio="none"
            >
              <polygon fill="currentColor" points="0 0 10 0 10 10"></polygon>
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
