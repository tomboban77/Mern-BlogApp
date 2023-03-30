import React from "react";
import blog from "../../img/blog.jpg";

const HomePage = () => {
  return (
    <>
      <section className="pb-10 bg-gray-400">
        <div className="relative container px-4   mx-auto">
          <div className="flex flex-wrap items-center -mx-4 mb-10 2xl:mb-14">
            <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
              {/* <span className="text-lg font-bold text-black-500">
                Create posts to educate
              </span> */}
              <h2 className="max-w-2xl mt-12 mb-12 text-6xl 2xl:text-8xl text-white font-bold font-heading">
                Apprehand your words into reality <br />
                <span className="text-gray-900 font-bold">
                  Come lets make a post
                </span>
              </h2>
              {/* <p className="mb-12 lg:mb-16 2xl:mb-24 text-xl text-gray-100">
                Your post must be free from racism and unhealthy words
              </p> */}
              <a
                className="inline-block px-12 py-5 text-lg text-white font-bold bg-yellow-600 hover:bg-yellow-900 rounded-full transition duration-200"
                href="/"
              >
                Purchase This Course
              </a>
            </div>
            <div className="w-full lg:w-1/2 px-4 pt-4">
              <img className="w-full" src={blog} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
