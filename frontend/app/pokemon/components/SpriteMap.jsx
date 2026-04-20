export default function SpriteMap({ pokemonList }) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {pokemonList.map((pokemon, index) => (
        <div
          key={pokemon._id}
          className="w-40 h-50 bg-gray-500 rounded flex flex-col items-center justify-center"
        >
          <img
            src={`/sprites/gen_9/${pokemon._id}.png`}
            alt={pokemon.name.english}
          />
          <div className="flex flex-col items-center">
            <span>{pokemon.name.english}</span>
            <span>NatNo.{pokemon._id}</span>
            <span>DexNo.{index + 1}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
