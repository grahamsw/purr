## ADDED Requirements

### Requirement: Random Walk Generation
The system SHALL generate a continuous stream of data points using a random walk algorithm.

#### Scenario: Periodic Data Update
- **WHEN** the 10-second timer fires
- **THEN** the system calculates a new value by adding a random step (-10 to 10) to the previous value, clamped between 0 and 1000

### Requirement: Configurable Stream Parameters
The system SHALL allow users to modify the update interval and the maximum step size of the random walk.

#### Scenario: Adjusting Interval
- **WHEN** the user changes the interval setting to 5 seconds
- **THEN** the data points are generated every 5 seconds instead of 10
