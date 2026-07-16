export default function SpriteMap({ pokemonList }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {pokemonList.map((pokemon, index) => (
        <div
          key={pokemon._id}
          className="w-40 h-40 border-2 border-purple-0 rounded flex flex-col items-center justify-center"
        >
          <img
            height={60}
            width={60}
            src={`/sprites/gen_9/${pokemon._id}.png`}
            alt={pokemon.name.english}
          />
          <div className="flex flex-col items-center justify-center">
            <span className=" text-purple-0">{pokemon.name.english}</span>
            <span className="font-bold text-purple-0">NatNo.{pokemon._id}</span>
            <span className="font-bold text-purple-0">DexNo.{index + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
