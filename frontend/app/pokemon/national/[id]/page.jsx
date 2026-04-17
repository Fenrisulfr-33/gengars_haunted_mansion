export const dynamic = 'force-dynamic';

// import PokemonPage from "@/components/pokemon/PokemonPage";
import PokemonPage from "./components/PokemonPage";

const getPokemon = async (id) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pokemon/national/${id}`);
  const pokemon = await response.json();
  return pokemon;
}

export default async function Page({ params }) {
  const { id } = await params;
  const pokemon = await getPokemon(id)

  return (
      <PokemonPage
        pokemon={pokemon}
        goBackRoute={"/pokemon/national"}
      />
  );
}