export const dynamic = 'force-dynamic';

import MovePage from "./components/MovePage";
import { api } from "@/app/api/RestfulAPIRequest";

const getMove = async (id) => {
  try {
      const response = await api.get(`/pokemon/moves/${id}`);
      const move = response.data;
      return move;
  } catch (error) {
      console.error("Error fetching move:", error);
      return null;
  }
}

export default async function Page({ params }) {
  const { id } = await params;
  const move = await getMove(id);

  return (
      <MovePage move={move} />
  );
}
