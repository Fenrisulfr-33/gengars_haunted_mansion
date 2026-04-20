import {
    types,
    normal,
    fire,
    water,
    electric,
    grass,
    ice,
    fighting,
    flying,
    ground,
    poison,
    psychic,
    bug,
    rock,
    ghost,
    dragon,
    dark,
    steel,
    fairy,
  } from "./typeChartRows";
  
  export default function TypeChart() {
    return (
      <div
        className={
          "w-max-fit bg-gray-700 rounded-lg  overflow-x-auto scrollbar-hide"
        }
      >
        <table
          className={
            "text-sm w-full bg-gray-600 border-2 border-purple-100 text-center rounded-lg border-separate"
          }
        >
          <thead></thead>
          <tr>
            {types.map((type, index) => (
              <th className={type.class} key={index}>
                {type.value}
              </th>
            ))}
          </tr>
          <tr>
            {normal.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {fire.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {water.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {electric.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {grass.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {ice.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {fighting.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {poison.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {ground.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {flying.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {psychic.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {bug.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {rock.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {ghost.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {dragon.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {dark.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {steel.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
          <tr>
            {fairy.map((data, index) => (
              <td className={data.class} key={index}>
                {data.value}
              </td>
            ))}
          </tr>
        </table>
      </div>
    );
  }
  