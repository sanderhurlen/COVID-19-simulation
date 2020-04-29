/**
 * An interface for simulation stats.
 */
export default interface SimulationStats {
    day: number;
    suceptible: number;
    infected: number;
    recovered: number;
    inQuarantine: number;
    dead: number;
}
