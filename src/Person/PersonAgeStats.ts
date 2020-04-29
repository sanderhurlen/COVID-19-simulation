/**
 * Interfaces for specifing the distribution of age for Persons in the simulation, as well as the mortality of the different age groups.
 * The simulation is required to handle age of the persons according to a chosen statistics,
 * i used statistics from this source: https://www.worldometers.info/coronavirus/coronavirus-age-sex-demographics/
 *
 * This file is very inspired by Christoffer Traeen (github.com/freshfish70/)
 * on his project: https://github.com/freshfish70/covid-simulation/blob/master/src/ts/age.ts
 * @author Christoffer Andersen Traeen, sander hurlen
 */

interface AgeMortality {
    age: number;
    mortality: number;
}

const ageMortalities: Array<AgeMortality> = [
    { age: 80, mortality: 0.148 },
    { age: 70, mortality: 0.08 },
    { age: 60, mortality: 0.036 },
    { age: 50, mortality: 0.013 },
    { age: 40, mortality: 0.004 },
    { age: 30, mortality: 0.002 },
    { age: 20, mortality: 0.002 },
    { age: 10, mortality: 0.002 },
    { age: 0, mortality: 0 },
];

interface AgeChances {
    maxAge: number;
    minAge: number;
    chance: number;
}

/**
 * The distribution of age in the simulation specified by their age interval
 */
const ageChances: Array<AgeChances> = [
    {
        maxAge: 90,
        minAge: 80,
        chance: 0.08,
    },
    {
        maxAge: 79,
        minAge: 60,
        chance: 0.2,
    },
    {
        maxAge: 59,
        minAge: 40,
        chance: 0.25,
    },
    {
        maxAge: 39,
        minAge: 20,
        chance: 0.3,
    },
    {
        maxAge: 19,
        minAge: 0,
        chance: 0.17,
    },
];

let totalAgeChanceDistribution = 0;

/** Selects a random age group based on a weighted table of age chances
 * @returns
 */
const selectAgeFromDistribution = function (): AgeChances {
    if (totalAgeChanceDistribution === 0) {
        for (const ageGroup of ageChances) {
            if (ageGroup.chance != null) totalAgeChanceDistribution += ageGroup.chance;
        }
    }

    let rnd = Math.random() * totalAgeChanceDistribution;
    for (const ageGroup of ageChances) {
        if (rnd < ageGroup.chance) return ageGroup;
        rnd -= ageGroup.chance;
    }

    // just in case the weighted table fails, return a default median value
    return ageChances[Math.floor(ageChances.length / 2)];
};

// Chosen as the avg +/- mortality rate
const defaultMortality = 0.03;

export { AgeMortality, ageMortalities, AgeChances, ageChances, defaultMortality, selectAgeFromDistribution };
