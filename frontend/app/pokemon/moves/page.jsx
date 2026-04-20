export const dynamic = 'force-dynamic';

// import MovesList from "@/components/pokemon/MovesList";
import MovesList from "./components/MovesList";
import { api } from "@/app/api/RestfulAPIRequest";

const getMoves = async () => {
  try {
    const moves = await api.get('/pokemon/moves');
    return Array.isArray(moves) ? moves : [];
  } catch (error) {
    console.error('Failed to fetch moves:', error);
    return [];
  }
}

export default async function Moves() {
  const moves = await getMoves();
  return <MovesList list={moves} />;
}
