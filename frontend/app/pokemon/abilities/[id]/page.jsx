export const dynamic = 'force-dynamic';

// import AbilitiesPage from "@/components/pokemon/AbilitiesPage";
import AbilitiesPage from "./components/AbilityPage";

const getAbility = async (id) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/pokemon/abilities/${id}`
  );
  const ability = await response.json();
  return ability;
};

export default async function Ability({ params }) {
  const { id } = await params;
  const ability = await getAbility(id);
  return <AbilitiesPage ability={ability} />;
}
