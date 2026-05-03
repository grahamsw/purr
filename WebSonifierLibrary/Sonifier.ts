/**
 * The interface a sonifier implementation must satisfy.
 * This is the audio black box — the Runner owns one of these
 * and drives it; clients never interact with it directly.
 */
interface Sonifier {

  /**
   * Returns the descriptor for this sonifier type.
   * Must be a stable, static value — the same object every call.
   */
  getDescriptor(): SonifierDescriptor;

  /**
   * Called by the Runner after instantiation, before start().
   * The sonifier should set up any audio graph nodes here
   * but not begin producing output.
   */
  initialize(): void;

  /**
   * Begin producing audio output.
   * Called by Runner.start().
   */
  start(): void;

  /**
   * Stop producing audio output and release all audio resources.
   * Called by Runner.stop().
   * The sonifier should be considered unusable after this.
   */
  stop(): void;

  /**
   * Set a parameter to a value.
   * The Runner is responsible for ensuring the value is valid
   * (correct type, within range) before calling this.
   * The sonifier can assume the value is legal.
   */
  setParameter(name: string, value: number | string | boolean): void;

  /**
   * Get the current value of a parameter.
   * Should return the default if the parameter has not been explicitly set.
   */
  getParameter(name: string): number | string | boolean;

  /**
   * Set the master amplitude, 0–1.
   * The sonifier is responsible for applying this to its output.
   */
  setAmplitude(value: number): void;

  getAmplitude(): number;
}