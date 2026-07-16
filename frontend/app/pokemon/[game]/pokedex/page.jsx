export const dynamic = 'force-dynamic';

import { search } from "@/app/components/variables/pokemonHeaders";
import PokedexList from "@/components/pokemon/PokedexList";
import { createSearchQuery } from "@/helperFunctions/createSearchQuery";
import SpriteMap from "../../components/SpriteMap";

const getPokedex = async (game, searchParams) => {
    if (Object.keys(searchParams).length > 0) {
        const searchQuery = createSearchQuery(searchParams);
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/pokemon/${game}/pokedex${searchQuery}`
        );
        const pokedex = await response.json();
        return pokedex;
    } else {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/pokemon/${game}/pokedex`
        );
        const pokedex = await response.json();
        return pokedex;
    }
};

export default async function Page({ params, searchParams }) {
    const { game } = await params;
    const resolvedSearchParams = await searchParams;
    const pokedex = await getPokedex(game, resolvedSearchParams);

    return (
        <div className="flex flex-col">
            <PokedexList
            list={pokedex}
            pushRoute={game}
            national={false}
            game={game}
            searchRoute={`/pokemon/${game}/pokedex`}
        />
        {/* <SpriteMap pokemonList={pokedex} /> */}
        </div>
    );
}
