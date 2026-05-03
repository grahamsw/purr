/**
 * A registered sonifier entry in the library.
 * The factory function creates a new independent instance each time.
 */
interface SonifierRegistration {
  descriptor: SonifierDescriptor;
  factory: () => Sonifier;
}

/**
 * The library is a registry of available sonifier types.
 * Clients query it to discover what's available, then instantiate.
 */
interface SonifierLibrary {
  
  /** Register a sonifier type, making it available for selection */
  register(registration: SonifierRegistration): void;

  /** List all registered sonifiers — enough info to populate a picker UI */
  list(): SonifierDescriptor[];

  /** 
   * Create a new instance of a named sonifier.
   * Throws if name is not registered.
   */
  create(name: string): Runner;
}