'use client';

import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

export default function PokemonSearchBar({
  selected,
  setSelected,
  placeholder,
  list = [],
}) {
  const [query, setQuery] = useState("");

  const filteredList =
    query.length < 3 || !list
      ? []
      : list.filter((value) =>
          value.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className={`relative m-2`}>
      <Combobox value={selected} onChange={setSelected}>
        <div className="bg-gray-900 row-flex justify-between cursor-default border-2 border-purple-100 overflow-hidden rounded-md ">
          <Combobox.Input
            className={`bg-gray-900 w-full p-2 text-sm text-gray-300 placeholder-gray-500 rounded-md`}
            displayValue={(value) => value.name}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder={placeholder}
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className={`absolute w-full mt-1 phone:test-base max-h-60 overflow-auto bg-gray-900 scrollbar-hide`}
          >
            {filteredList.length === 0 && query !== "" ? (
              <div></div>
            ) : (
              filteredList.map((value) => (
                <Combobox.Option
                  key={value.query}
                  className={({ active }) =>
                    ` cursor-default select-none m-2 w-auto ${active ? `font-bold border-2 border-gray-100` : ``}`
                  }
                  value={value}
                >
                  <div className={`truncate`}>{value.name}</div>
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
}
