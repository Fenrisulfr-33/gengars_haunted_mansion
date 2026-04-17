export const dynamic = 'force-dynamic';

import PokedexList from "@/components/pokemon/PokedexList";
import { createSearchQuery } from "@/helperFunctions/createSearchQuery";
import MoveBoxSearch from "./components/MoveBoxSearch";

const getAllMoveNames = async () => {
    const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/pokemon/moves/names`
    );
    const movesList = await response.json();
    return movesList;
};

const getPokemonByMoves = async (searchParams) => {
    if (Object.keys(searchParams).length > 0) {
        const searchQuery = createSearchQuery(searchParams);
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/pokemon/search/${searchQuery}`
        );
        const searchResults = await response.json();
        return searchResults;
    } else {
        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/pokemon/search`
        );
        const searchResults = await response.json();
        return searchResults;
    }
};

export default async function Page({ params, searchParams }) {
    const resolvedSearchParams = await searchParams;
    const searchResults = await getPokemonByMoves(resolvedSearchParams);
    const movesNameList = await getAllMoveNames();
    return (
        <div className="flex flex-col m-2 space-y-4">
            <div className="article-container">
                <h1> Search for Pokemon by Moveset</h1>

                <p>
                    This moveset search is only compatible with scarlet and
                    violet pokemon at the moment. Eventually there will be a
                    game drop down which will change what moves you can search
                    for and what pokemon in those games can learn that move.
                </p>
                <p>
                    The reason for this is because even if a pokemon can learn a
                    move in a different game they might not be able to use it in
                    the current format making it an illegal move. If a pokemon
                    is not coming up that you know learns a move please contact
                    me at GengarsHauntedMansion@proton.me
                </p>
            </div>
            <MoveBoxSearch list={movesNameList} />
            <PokedexList
                list={searchResults}
                pushRoute={"scarlet-violet"}
                national={false}
                game={"scarlet-violet"}
                search={true}
                searchRoute={`/pokemon/search`}
            />
        </div>
    );
}
