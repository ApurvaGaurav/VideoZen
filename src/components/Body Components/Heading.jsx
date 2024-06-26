import React, { useEffect, useState, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { toggleDarkMode, toggleMenu } from "../../Utils/appSlice";
import { YOUTUBE_SUGGESTION_API } from "../../Utils/Constants";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

const Heading = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState();
  const navigate = useNavigate();

  const isDarkModeActive = useSelector((store) => store.app.darkMode);
  const handleDarkModeSwitch = () => {
    dispatch(toggleDarkMode());
  };
  const dispatch = useDispatch();
  const handleHamburgerClick = () => {
    dispatch(toggleMenu());
  };

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let timer = setTimeout(() => {
      getSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const getSuggestions = async () => {
    const data = await fetch(YOUTUBE_SUGGESTION_API + "&q=" + searchText);
    const result = await data.json();
    setSuggestions(result[1]);
  };

  const handleSuggestionClick = async (e) => {
    setShowSuggestion(false);
    setSearchText(e.target.innerText);
  };

  const onSearchBtnClick = async () => {
    if (searchText !== "") {
      navigate(`/search?result=` + searchText);
      setShowSuggestion(false);
    }
  };

  const handleEnterPress = async (e) => {
    if (e.key === "Enter" && searchText !== "") {
      navigate(`/search?result=` + searchText);
      setShowSuggestion(false);
    }
  };
  const InputElement = useRef();
  const hamBurger = useRef();
  const Icon = useRef();
  const handleSmallSearchClick = () => {
    InputElement.current.classList.toggle("hidden");
    InputElement.current.classList.add("flex");
    hamBurger.current.classList.remove("hidden");
    Icon.current.classList.toggle("hidden");
  };

  return (
    <div
      className={`${
        isDarkModeActive ? "bg-gray-900" : "bg-white"
      } flex flex-col p-3 justify-between shadow-md lg:p-3 fixed top-0 w-full z-10`}
    >
      <div className="headeronly flex justify-between w-full">
        <div className="logo-hamburger flex items-center ">
          <div ref={hamBurger}>
            <GiHamburgerMenu
              className={` ${
                isDarkModeActive
                  ? "text-white lg:hover:bg-black"
                  : "text-black lg:hover:bg-gray-200"
              } text-4xl cursor-pointer rounded-full font-extrabold p-2 lg:mr-4 transition-all`}
              onClick={() => handleHamburgerClick()}
            />
          </div>
          <div className="flex" ref={Icon}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5667/5667341.png"
              alt=""
              className=" h-8 lg:h-10  cursor-pointer"
            />
            <span
              className={`${
                isDarkModeActive ? "text-white" : "text-black"
              } font-LilitaOne lg:text-2xl text-xl mt-1`}
            >
              VideoZen
            </span>
          </div>
        </div>
        <div
          className="searchBar-voiceassistant lg:flex lg:w-1/2 items-center hidden justify-center"
          ref={InputElement}
        >
          <input
            type="text"
            placeholder="Search"
            className={`${
              isDarkModeActive ? "bg-gray-900 text-white" : "bg-white"
            } border-2 border-gray-300 w-full rounded-l-full py-[0.4rem] px-3`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setShowSuggestion(true)}
            onKeyDown={(e) => handleEnterPress(e)}
            onMouseEnter={() => setShowSuggestion(true)}
            onMouseLeave={() => setShowSuggestion(false)}
          />
          <IoIosSearch
            className=" bg-gray-200 text-[2.5rem] py-1 px-2 rounded-r-full hover:cursor-pointer active:bg-black active:text-white transition-all"
            onClick={onSearchBtnClick}
          />
          <MdKeyboardVoice className=" bg-gray-200 text-[2.5rem] p-2 ml-5 rounded-full hidden lg:block" />
        </div>
        <div className="videoadd-notification-user justify-around gap-1 flex items-center">
          <FaSearch
            className={` ${
              isDarkModeActive ? "text-white" : ""
            } text-lg mr-2 lg:hidden`}
            onClick={handleSmallSearchClick}
          />
          <div className="darkModeIcon">
            {isDarkModeActive ? (
              <MdOutlineDarkMode
                className="text-[1.6rem] lg:text-3xl cursor-pointer text-white"
                onClick={() => handleDarkModeSwitch()}
              />
            ) : (
              <MdDarkMode
                className="text-[1.6rem] lg:text-3xl cursor-pointer "
                onClick={() => handleDarkModeSwitch()}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className={` ${
          isDarkModeActive ? "bg-gray-800 text-white" : "bg-white"
        } suggestions hidden lg:block lg:ml-[29rem] w-full lg:w-[40.4rem] shadow-xl absolute top-12`}
        onMouseLeave={() => setShowSuggestion(false)}
        onMouseEnter={() => setShowSuggestion(true)}
      >
        {showSuggestion &&
          suggestions.map((suggestion) => (
            <Link
              to={`/search?result=` + suggestion}
              onClick={handleSuggestionClick}
              key={suggestion}
            >
              <p
                className={` ${
                  isDarkModeActive ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } my-2 p-2 hover:bg-gray-100 hover:cursor`}
              >
                <span className="flex items-center gap-2">
                  <CiSearch className="mt-1" />
                  {suggestion}
                </span>
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Heading;
