/**
 * The metadata a sonifier exposes about itself.
 * Enough for a client to populate a picker and auto-generate a config UI.
 */
interface SonifierDescriptor {
  /** Unique name, used as the key in SonifierLibrary */
  name: string;

  /** Human-readable description for display in a picker UI */
  description: string;

  /** All parameters the sonifier exposes, keyed by parameter name */
  parameters: Record<string, ParameterDescriptor>;
}

/**
 * Metadata for a single sonifier parameter.
 * The type field determines which other fields are relevant.
 */
type ParameterDescriptor =
  | NumberParameterDescriptor
  | EnumParameterDescriptor
  | BooleanParameterDescriptor;

interface BaseParameterDescriptor {
  /** Human-readable label for UI display */
  label: string;

  /** Longer explanation of what this parameter does */
  description: string;

  /** Whether this parameter can be nominated as a sonification target.
   *  Only number parameters can be nominated, but this flag lets a
   *  sonifier author mark specific numbers as non-nominatable
   *  (e.g. a sample rate that shouldn't be driven by data).
   */
  nominatable: boolean;
}

interface NumberParameterDescriptor extends BaseParameterDescriptor {
  type: 'number';
  min: number;
  max: number;
  default: number;
  /** Suggested step size for a slider. Optional — UI can choose its own. */
  step?: number;
  /** Unit label for display, e.g. 'Hz', 'ms', 'dB' */
  unit?: string;
}

interface EnumParameterDescriptor extends BaseParameterDescriptor {
  type: 'enum';
  options: EnumOption[];
  default: string;
}

interface EnumOption {
  value: string;
  label: string;
  /** Optional longer description, e.g. for a tooltip */
  description?: string;
}

interface BooleanParameterDescriptor extends BaseParameterDescriptor {
  type: 'boolean';
  default: boolean;
}