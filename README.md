# COVID-19-simulation

A agent-based model of COVID-19 spread. Created for use in Statistics and Simulation course at NTNU

## Project Description

**Oblig 5 – Simulering av Corona-utbruddet**
_IR201812 Statistikk og Simulering_

**Del I: Reprodusere scenarioene i Washington Post-artikkelen**
Utgangspunktet for prosjektet blir denne artikkelen i Washington Post: [article](https://www.washingtonpost.com/graphics/2020/world/corona-simulator/)
I artikkelen anvendes SIR-modellen (susceptible-infectuous-recovered) for å
skissere et svært forenklet bilde av virkeligheten, men som gir mye innsikt i
noen essensielle egenskaper av spredningsforløpet.
En intro om bl.a. SIR-modeller: [article](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology)
Vi skal ikke bruke den samme modellen som i Washington Post-artikkelen,
men vi bruker rasterbasert simulering (enten av agenter som beveger seg på
et rutenett, eller en cellular automaton). I Wikipedia-artikkelen over vises en
slik rasterbasert simulering av en SIR-model.

# Project Goal

### Part 1: Reproduce Washington Post simulation

1. Reproduce the results from Washington post article

    In the first scenario (free mobility), you are going to adjust the probability for a sick person comes in contact with a random healthy person. This way, every sick person in the beginning of the simulation (the exponential phase), comes in contact with 2.5 other persons, which is the reported value for Corona.

1. Do you get a similar result of antall/friske/smittsomme/resistant persons as a function of time, as in the WP article for the 4 scenarios?
1. If you scale the number of persons and area proporsionally, what is the numbers for the total population in a "imagined land" with , e.g. 100 000 residents.

### Part 2: Simulation of number of deaths

-   Add a probability for a diseased person to die of Corona

How many of the residents (Imaginary land of 100 000 residents) will die?

### Part 3: Effect of Age

The effect of age has been a factor for the severeness of the disease. Therefore, we add a age parameter.

-   Create a age-categories of 0-9, 10-19, 20-29... etc
-   Join fatality to a function of age in the model
-   Simulate different scenarios where mobility is a function of age. _For instance:_
    -   Everybody is quarantined
    -   Full mobility
    -   All elders (over 70 y) is quarantined
-   How does the share of individs who dies as a result of mobility differ?
-   How is number of deaths as a function of age in the different scenearios?

### Part 4: Back to normal

What happens when a society reverts from quaratine to normal life after a amount of time. For instance, after a half year.

-   then look at consequences of new infections
-   Compare with simulations from part 3

## Project requirements

-   Have all parts from project fulfilled

## Simulation data points

#### Have been diseased:

-   **Incubation time -** 4 days
-   **sickness period** - 14 days

## what i want to learn & use

-   Webpack
-   TypeScript
-   P5.js
-   Unit testing framework - Mocha with Node assertion (for now)
-   Chart.js
