Speedup formula

$S = \frac{T_{old}}{T_{new}}$

$\frac{T_{old}-T_{new}}{T_{old}} * 100$

| Function 					| Old Speed | New Speed | Speedup 	|
| -							| -			| -			| -			|
| GET abilities			 	| 72ms		| ~66ms		| 8.33%		| 
| GET ability				| 156ms		| ~20ms		| 87.17%	|


# Changes

1. 2026-08-23 GET abilities added `.lean()` to end of query.
2. 2026-08-23 GET ability has pokemonWithAbility built in removed unnecessary GET national and search for all pokemon with ability.