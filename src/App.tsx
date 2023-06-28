import { useState } from "react";
import axios from "axios";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axiosJsonpAdapter from "axios-jsonp";

import googleLogo from "./assets/google.svg";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [originalTerm, setOriginalTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const showSuggest = async (text: string) => {
    await setOriginalTerm(text);
    await setSearchTerm(text);

    const request = await axios.get(
      `https://www.google.com/complete/search?client=chrome&q=${text}`,
      {
        adapter: axiosJsonpAdapter,
      }
    );
    const data = await request.data;

    setSuggestions(data[1]);
  };

  const setFocusSuggestion = (text: string) => {
    setSearchTerm(text);
  };

  const setBlurSuggestion = () => {
    setSearchTerm(originalTerm);
  };

  const doSearch = (text?: string) => {
    if (!text) {
      text = searchTerm;
    }

    if (text.startsWith("https://") || text.startsWith("http://")) {
      window.open(text, "_self");
    } else {
      window.open(`https://www.google.com/search?q=${text}`, "_self");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      doSearch();
    }
  };

  document.addEventListener("keydown", handleKeyDown);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#202124]">
      <form
        className="flex flex-col items-center justify-center pb-44"
        onSubmit={(e) => {
          e.preventDefault();
          doSearch();
        }}
        target="_self"
      >
        <img
          src={googleLogo}
          alt="Google logo"
          className="mb-9 h-20"
          draggable={false}
        />

        <div className="relative">
          <input
            type="text"
            title="Search"
            className="focus w-[50vw] max-w-2xl rounded-full border border-gray-300 bg-[#303134] px-5 py-2
          text-2xl text-white focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus={true}
            autoComplete="off"
            value={searchTerm}
            onChange={async (e) => await showSuggest(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 mt-2 w-full rounded-md bg-[#303134] py-2 text-white">
              {suggestions.map((suggestion, index) => {
                if (index < 8) {
                  return (
                    <li
                      key={index}
                      className="cursor-pointer px-5 py-2 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                      tabIndex={0}
                      onClick={() => doSearch(suggestion)}
                      onFocus={() => setFocusSuggestion(suggestion)}
                      onBlur={() => setBlurSuggestion()}
                    >
                      {suggestion}
                    </li>
                  );
                }
              })}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;
