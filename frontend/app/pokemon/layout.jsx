import PokemonMenu from "@/components/pokemon/PokemonMenu";

export default async function PokemonLayout({ children }) {
  let searchList = [];
  
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/pokemon`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      searchList = await response.json();
    } else {
      console.error('Failed to fetch Pokemon list:', response.status);
    }
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
  }
  
  return (
    <div className="flex flex-col tablet:flex-row">
      <PokemonMenu searchList={searchList} />
      <div className="tablet:w-4/5">{children}</div>
    </div>
  );
}
