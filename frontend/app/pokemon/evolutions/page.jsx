export const dynamic = "force-dynamic";

import { api } from "@/app/api/RestfulAPIRequest";
import React from "react";
import Image from "next/image";

const getEvolutions = async () => {
    try {
        const evolutions = await api.get("/pokemon/evolutions");
        return Array.isArray(evolutions) ? evolutions : [];
    } catch (error) {
        console.error("Failed to fetch evolutions:", error);
        return [];
    }
};

/**
 * An evolution chain starts off flex row
 * @param {{ evolution: Object }} param0
 * @returns {JSX.Element}
 */
// const EvolutionChain = ({ evolution }) => {
// 	return (
// 		<div className="flex flex-col items-center">

// 		</div>
// 	);
// }

/**
 *  The top level array contains arrays of evolutions,
 * 		this should be flex-col
 * where each inner array represents a chain of evolutions for a specific Pokémon.
 * 		this should be flex row
 * Each evolution chain can contain and array of multiple choices.
 * 		this should be flex-col
 * And of the multiple choices, they can be arrays of evolutions chains,
 * 		this should be flex-row>
 * @param {*} param0
 * @returns
 */
const EvolutionsList = ({ list }) => {
    return (
        <div>
            <h1>Evolutions</h1>
            <ul>
                {list.map((evolution) => (
                    <li
                        key={evolution._id}
                        className="border p-4 mb-4 flex flex-col"
                    >
                        <EvolutionChart entry={evolution} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

// TESTING

/**
 * Renders one evolution entry (the shape validated by ./schema.json).
 *
 * Layout mirrors the data's own nesting instead of a generic tree renderer:
 *   evolution (top array)      -> flex-col   (one row per chain line)
 *   chain     (array of nodes) -> flex-row   (left-to-right evolution)
 *   branch    (array inside a chain node)  -> flex-col (stacked choices)
 *   chain     (array inside a branch option) -> flex-row (continues on)
 * Chain and Branch call back into each other, so the row/col orientation
 * flips automatically at every depth without any special-casing.
 */
function EvolutionChart({ entry }) {
    return (
        <div className="flex flex-col gap-6 rounded-2xl bg-slate-950 p-6">
            <header className="flex items-baseline gap-3 text-slate-300">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                    Chain #{entry._id}
                </span>
                <span className="text-xs text-slate-500">
                    Gen {entry.generation}
                </span>
            </header>

            <div className="flex flex-col gap-6">
                {entry.evolution.map((chainNodes, i) => (
                    <Chain key={i} nodes={chainNodes} />
                ))}
            </div>
        </div>
    );
}

function isStage(node) {
    return !Array.isArray(node);
}

/** A left-to-right evolution line: Stage -> Stage -> (Stage | Branch) -> ... */
function Chain({ nodes, leadingHow }) {
    return (
        <div className="flex flex-row flex-wrap items-center gap-3">
            {nodes.map((node, i) => {
                const content = isStage(node) ? (
                    <StageCard stage={node} />
                ) : (
                    <Branch options={node} />
                );

                if (i === 0) {
                    return (
                        <NodeWithHow key={i} how={leadingHow}>
                            {content}
                        </NodeWithHow>
                    );
                }

                return (
                    <React.Fragment key={i}>
                        <Arrow how={isStage(node) ? node.how : null} />
                        {content}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

/** A stacked set of alternative next steps, each terminal or its own chain. */
function Branch({ options }) {
    return (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-3">
            {options.map((option, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <OrDivider />}
                    {isStage(option) ? (
                        <NodeWithHow how={option.how}>
                            <StageCard stage={option} />
                        </NodeWithHow>
                    ) : (
                        <Chain
                            nodes={option}
                            leadingHow={
                                isStage(option[0]) ? option[0].how : null
                            }
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

/** Stacks a "how" caption above a stage/branch when no Arrow precedes it. */
function NodeWithHow({ how, children }) {
    return (
        <div className="flex flex-col items-center gap-0.5">
            {how && <HowLabel how={how} />}
            {children}
        </div>
    );
}

function StageCard({ stage }) {
    const label = stage.form ?? stage.name;
    const subLabel =
        stage.form && stage.form !== stage.name ? stage.name : null;

    return (
        <div className="flex min-w-[9.5rem] flex-col items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-center shadow-sm">
            <Image
                src={`/sprites/gen_9/${stage.id}.png`}
                alt={label}
                width={108}
                height={108}
                className="mx-auto"
            />
            <div className="flex flex-col items-center leading-tight">
                <span className="text-sm font-semibold text-slate-100">
                    {label}
                </span>
                {subLabel && (
                    <span className="text-[10px] text-slate-500">
                        {subLabel}
                    </span>
                )}
            </div>

            <span className="font-mono text-[10px] text-slate-500">
                #{stage.id}
            </span>

            <div className="flex flex-wrap justify-center gap-1">
                {stage.type.map((t) => (
                    <span
                        key={t}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white ${
                            TYPE_COLORS[t] ?? "bg-slate-600"
                        }`}
                    >
                        {t}
                    </span>
                ))}
            </div>
        </div>
    );
}

function Arrow({ how }) {
    return (
        <div className="flex flex-col items-center gap-0.5">
            <span
                aria-hidden
                className="shrink-0 select-none text-lg text-slate-600"
            >
                &rarr;
            </span>
            {how && <HowLabel how={how} />}
        </div>
    );
}

function HowLabel({ how }) {
    return (
        <span className="whitespace-nowrap rounded bg-slate-700/70 px-1.5 py-0.5 text-[10px] text-slate-300">
            {how}
        </span>
    );
}

function OrDivider() {
    return (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            or
        </span>
    );
}

const TYPE_COLORS = {
    Normal: "bg-neutral-500",
    Fire: "bg-orange-600",
    Water: "bg-blue-500",
    Electric: "bg-yellow-500",
    Grass: "bg-green-600",
    Ice: "bg-cyan-400",
    Fighting: "bg-red-700",
    Poison: "bg-purple-600",
    Ground: "bg-amber-700",
    Flying: "bg-indigo-400",
    Psychic: "bg-pink-500",
    Bug: "bg-lime-600",
    Rock: "bg-yellow-800",
    Ghost: "bg-violet-800",
    Dragon: "bg-indigo-700",
    Dark: "bg-neutral-800",
    Steel: "bg-slate-500",
    Fairy: "bg-pink-300",
};

export default async function Evolutions() {
    const evolutions = await getEvolutions();
    return <EvolutionsList list={evolutions} />;
}
