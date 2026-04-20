import Image from "next/image";
import Link from "next/link";
import { typeColors } from "../variables/typeColors";

export default function PokedexRow({ pokemon, dexNo, national, pushRoute }) {
  const {
    _id,
    baseStats: { total, hp, atk, def, spatk, spdef, spd },
    name,
    type: { one, two },
    abilities,
  } = pokemon;
  const stats = [total, hp, atk, def, spatk, spdef, spd];
  const abilityRoute = '/pokemon/abilities/';
  const abilityOne = abilities?.one?.name.toLowerCase().replaceAll(' ', '-');
  const abilityTwo = abilities?.two?.name.toLowerCase().replaceAll(' ', '-');
  const abilityHidden = abilities?.hidden?.name.toLowerCase().replaceAll(' ', '-');
  return (
    <tr className="table-row space-x-2">
      {national ? <td className="">{_id}</td> : <><td>{dexNo}</td><td>{_id}</td></>}
      <td className="whitespace-nowrap">
        <Link
          href={`/pokemon/national/${_id}/${pushRoute}`}
          passhref="true"
          className="text-purple-0 font-bold hover:text-purple-50"
        >
          {name.english}
        </Link>
      </td>
      <td className="">
        <div className="flex justify-center">
          <Image
            src={`/sprites/gen_9/${_id}.png`}
            alt={name?.english}
            height={60}
            width={60}
          />
        </div>
      </td>
      <td className="">
        <div className="font-bold flex flex-col">
          <div
            className={`col-span-1 my-1 rounded-md px-2 space-x-1 font-bold ${
                typeColors[one.toLowerCase()] || ""
            }`}
          >
            {one}
          </div>
          {two && (
            <div
              className={`col-span-1 my-1 rounded-md px-2 space-x-1 font-bold ${
                typeColors[two.toLowerCase()] || ""
              }`}
            >
              {two}
            </div>
          )}
        </div>
      </td>
      <td className="">
        <div className="flex flex-col">
          <div><Link href={`${abilityRoute}${abilityOne}`} className="text-purple-0 font-bold hover:text-purple-50">{abilities?.one?.name}</Link></div>
          <div><Link href={`${abilityRoute}${abilityTwo}`} className="text-purple-0 font-bold hover:text-purple-50">{abilities?.two?.name}</Link></div>
          <div><Link href={`${abilityRoute}${abilityHidden}`} className="italic text-purple-0 font-bold hover:text-purple-50">{abilities?.hidden?.name}</Link></div>
        </div>
      </td>
      {stats.map((stat, index) => (
        <td key={index} className="whitespace-nowrap">
          {stat}
        </td>
      ))}
    </tr>
  );
}
