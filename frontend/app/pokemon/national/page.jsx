export const dynamic = 'force-dynamic';

import NationalDexList from "./components/NationalDexList";
import { createSearchQuery } from "@/helperFunctions/createSearchQuery";

const getNationalDex = async (searchParams) => {
  let searchQuery = "";

  if (Object.keys(searchParams).length > 0){
    searchQuery = createSearchQuery(searchParams);
  }

  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pokemon/national${searchQuery}`);
  const nationalDex = await response.json();
  return Array.isArray(nationalDex) ? nationalDex : [];
}

export default async function Page({ params, searchParams }) {
  const resolvedSearchParams = await searchParams;
  const nationalDex = await getNationalDex(resolvedSearchParams);

  return (
    <NationalDexList pokedex={nationalDex} />
  );
}
