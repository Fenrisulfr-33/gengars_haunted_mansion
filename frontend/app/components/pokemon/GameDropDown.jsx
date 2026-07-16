import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { BsChevronExpand, BsCheck, BsSearch } from "react-icons/bs";
import { gameColors } from "../variables/gameColors";

export default function GameDropDown({
  selected,
  setSelected,
  placeholder,
  list,
}) {
  const [query, setQuery] = useState("");

  const filteredList =
    query === ""
      ? list
      : list.filter((value) =>
          value.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className="relative m-2 w-full max-w-md">
      <Combobox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-gray-900 text-left shadow-lg shadow-purple-900/20 border-2 border-purple-400 transition-all duration-200 hover:border-purple-300 focus-within:border-purple-200 focus-within:ring-2 focus-within:ring-purple-400/50">
                {/* Search Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <BsSearch
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>

                <Combobox.Input
                  className="w-full bg-transparent border-none py-3 pl-10 pr-12 text-sm leading-5 text-gray-100 placeholder:text-gray-500 focus:ring-0 focus:outline-none"
                  displayValue={(value) => value?.title || ""}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={placeholder || "Select a game..."}
                />

                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-800/50 px-2 rounded-r-lg transition-colors">
                  <BsChevronExpand
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute z-10 mt-2 w-full max-h-72 overflow-auto rounded-lg bg-gray-900 py-1 text-base shadow-2xl shadow-purple-900/30 border-2 border-purple-400 focus:outline-none sm:text-sm custom-scrollbar">
                {filteredList.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-3 px-4 text-gray-400 text-center">
                    <p className="font-medium">No games found</p>
                    <p className="text-xs mt-1 text-gray-500">
                      Try a different search term
                    </p>
                  </div>
                ) : (
                  filteredList.map((value) => (
                    <Combobox.Option
                      key={value.key}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-3 px-4 mx-2 my-1 rounded-md transition-all duration-150 ${
                          gameColors[value.key] || "bg-gray-800 text-gray-100"
                        } ${
                          active
                            ? "shadow-md transform scale-[1.02] ring-2 ring-white/30"
                            : "shadow-sm"
                        }`
                      }
                      value={value}
                    >
                      {({ selected, active }) => (
                        <div className="flex items-center justify-between">
                          <span
                            className={`block truncate ${
                              selected ? "font-bold" : "font-medium"
                            }`}
                          >
                            {value.title}
                          </span>
                          {selected && (
                            <BsCheck
                              className="h-6 w-6 flex-shrink-0 ml-2"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </>
        )}
      </Combobox>
    </div>
  );
}
