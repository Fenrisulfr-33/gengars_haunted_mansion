export const dynamic = 'force-dynamic';

import MovePage from '../components/MovePage'

const getMoveByGame = async (id, game) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pokemon/moves/${id}/${game}`);
  const move = await response.json();
  return move;
}

export default async function MoveByGame({ params }) {
  const { id, game } = await params;
  const moveByGame = await getMoveByGame(id, game);
  return <MovePage move={moveByGame} game={game} />;
}