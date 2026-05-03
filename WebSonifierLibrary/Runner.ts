/**
 * A configured sonifier instance. This is what the client works with.
 * Parameters are either statically set or nominated for data feeding —
 * never both.
 */
interface Runner {

  /**
   * Set a parameter to a fixed value.
   * Throws if the parameter name is unknown.
   * Throws if the parameter is currently nominated.
   */
  set(param: string, value: number | string | boolean): void;

  /**
   * Nominate a parameter as a sonification target, with mapping config.
   * Throws if the parameter name is unknown.
   * Throws if the parameter type is not number (only numbers can be mapped).
   * Calling nominate on an already-nominated parameter replaces its mapping.
   * Calling nominate on a statically-set parameter removes the static value.
   */
  nominate(param: string, mapping: MappingConfig): void;

  /**
   * Withdraw a nomination, returning the parameter to its default static value.
   * Throws if the parameter is not currently nominated.
   */
  unnominate(param: string): void;

  /**
   * Feed a new data value to a nominated parameter.
   * Throws if the parameter is not currently nominated.
   * Triggers mapping and updates the sonifier.
   */
  feed(param: string, value: number): void;

  /**
   * Master amplitude, 0–1. Independent of any parameter mapping.
   * Defaults to 1.
   */
  setAmplitude(value: number): void;
  getAmplitude(): number;

  /**
   * Start audio output. Sonifier may produce silence until
   * nominated parameters receive their first feed().
   */
  start(): void;

  /**
   * Stop audio output and release audio resources.
   */
  stop(): void;

  /**
   * Snapshot the current configuration — which params are nominated,
   * their mapping configs, and static values for the rest.
   * Useful for serializing a setup to restore later.
   */
  getConfig(): RunnerConfig;

  /**
   * Restore a previously snapshotted configuration.
   * Throws if the config references unknown parameters.
   */
  applyConfig(config: RunnerConfig): void;
}

/**
 * Serializable snapshot of a Runner's configuration.
 */
interface RunnerConfig {
  sonifierName: string;
  amplitude: number;
  staticParams: Record<string, number | string | boolean>;
  nominatedParams: Record<string, MappingConfig>;
}