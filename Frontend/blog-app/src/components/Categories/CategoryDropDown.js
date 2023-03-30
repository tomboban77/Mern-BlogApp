import React from "react";
import Select from "react-select";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCategory } from "../../redux/slices/categorySlice";
import Loader from "react-spinners/CircleLoader";

const CategoryDropDown = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  const category = useSelector((state) => state?.category);
  const { categoryList, loading } = category;

  const allCategories = categoryList?.map((cat) => {
    return {
      label: cat?.title,
      value: cat?._id,
    };
  });

  const handleChange = (value) => {
    props.onChange("category", value);
  };

  const handleBlur = () => {
    props.onBlur("category", true);
  };

  return (
    <div style={{ margin: "1rem 0" }}>
      {loading ? (
        <Loader />
      ) : (
        <Select
          value={props?.value?.label}
          onChange={handleChange}
          onBlur={handleBlur}
          id="category"
          options={allCategories}
        />
      )}
      {props.error && <div className="text-red-500 mt-2">{props?.error}</div>}
    </div>
  );
};

export default CategoryDropDown;
