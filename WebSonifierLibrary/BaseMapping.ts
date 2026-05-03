/**
 * Configuration for how a raw data value is mapped to a parameter value.
 * A parameter is mapped using either a static range or dynamic normalization.
 */
type MappingConfig = StaticMappingConfig | DynamicMappingConfig;

interface BaseMappingConfig {
  /**
   * The curve applied when mapping input to output range.
   * - linear:      output scales proportionally with input
   * - exponential: emphasises high end — good for frequency (pitch perception)
   * - logarithmic: emphasises low end — good for amplitude (loudness perception)
   */
  curve: 'linear' | 'exponential' | 'logarithmic';

  /**
   * The output range — i.e. the parameter's driven range.
   * Defaults to [parameter.min, parameter.max] if omitted.
   */
  outMin?: number;
  outMax?: number;

  /**
   * If true, incoming values outside the input range are clamped
   * rather than extrapolated. Defaults to true.
   */
  clamp?: boolean;
}

interface StaticMappingConfig extends BaseMappingConfig {
  type: 'static';

  /** The fixed input range the data is expected to occupy */
  inMin: number;
  inMax: number;
}

interface DynamicMappingConfig extends BaseMappingConfig {
  type: 'dynamic';

  /**
   * The starting range used as a cold-start fallback,
   * and as the initial prior for the blending process.
   */
  startRange: [number, number];

  /**
   * How many samples to collect before the dynamic range
   * is considered fully established. During this window,
   * the effective range blends from startRange toward the
   * observed mean ± (sensitivity * σ).
   * Defaults to 30.
   */
  warmupSamples?: number;

  /**
   * How many recent samples the normalizer tracks.
   * Older samples are discarded.
   * Defaults to 100.
   */
  windowSize?: number;

  /**
   * How many standard deviations from the mean define the edges
   * of the normalized range. Higher = more headroom for spikes.
   * Defaults to 2.
   */
  sensitivity?: number;

  /**
   * How an out-of-range value is handled:
   * - clamp:  sounds at max/min, no immediate range update
   * - expand: immediately widens the range to include the value
   * Defaults to 'expand'.
   */
  outOfRange?: 'clamp' | 'expand';
}