export type DashboardStyle = 'compact' | 'sedan' | 'suv' | 'truck' | 'luxury';

export interface CarEntry {
  make: string;
  model: string;
  hasDualZone: boolean;
  hasRearVents: boolean;
  dashboardStyle: DashboardStyle;
}

export const CARS: CarEntry[] = [
  // Toyota
  { make: 'Toyota', model: 'RAV4', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  { make: 'Toyota', model: 'Camry', hasDualZone: true, hasRearVents: false, dashboardStyle: 'sedan' },
  { make: 'Toyota', model: 'Corolla', hasDualZone: false, hasRearVents: false, dashboardStyle: 'compact' },
  { make: 'Toyota', model: 'Tacoma', hasDualZone: false, hasRearVents: false, dashboardStyle: 'truck' },
  // Honda
  { make: 'Honda', model: 'Civic', hasDualZone: false, hasRearVents: false, dashboardStyle: 'compact' },
  { make: 'Honda', model: 'CR-V', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  { make: 'Honda', model: 'Accord', hasDualZone: true, hasRearVents: false, dashboardStyle: 'sedan' },
  { make: 'Honda', model: 'Pilot', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  // Ford
  { make: 'Ford', model: 'F-150', hasDualZone: true, hasRearVents: false, dashboardStyle: 'truck' },
  { make: 'Ford', model: 'Explorer', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  { make: 'Ford', model: 'Bronco', hasDualZone: false, hasRearVents: false, dashboardStyle: 'truck' },
  // Chevy
  { make: 'Chevy', model: 'Silverado', hasDualZone: true, hasRearVents: false, dashboardStyle: 'truck' },
  { make: 'Chevy', model: 'Equinox', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  { make: 'Chevy', model: 'Tahoe', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  // Tesla
  { make: 'Tesla', model: 'Model 3', hasDualZone: true, hasRearVents: true, dashboardStyle: 'luxury' },
  { make: 'Tesla', model: 'Model Y', hasDualZone: true, hasRearVents: true, dashboardStyle: 'luxury' },
  // BMW
  { make: 'BMW', model: '3-Series', hasDualZone: true, hasRearVents: false, dashboardStyle: 'luxury' },
  { make: 'BMW', model: 'X3', hasDualZone: true, hasRearVents: true, dashboardStyle: 'luxury' },
  // Subaru
  { make: 'Subaru', model: 'Outback', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  { make: 'Subaru', model: 'Forester', hasDualZone: false, hasRearVents: true, dashboardStyle: 'suv' },
  // Hyundai
  { make: 'Hyundai', model: 'Tucson', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  { make: 'Hyundai', model: 'Elantra', hasDualZone: false, hasRearVents: false, dashboardStyle: 'compact' },
  // Nissan
  { make: 'Nissan', model: 'Rogue', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  { make: 'Nissan', model: 'Altima', hasDualZone: true, hasRearVents: false, dashboardStyle: 'sedan' },
  // Jeep
  { make: 'Jeep', model: 'Wrangler', hasDualZone: false, hasRearVents: false, dashboardStyle: 'truck' },
  { make: 'Jeep', model: 'Grand Cherokee', hasDualZone: true, hasRearVents: true, dashboardStyle: 'suv' },
  // Generic
  { make: 'Generic', model: 'Not Listed', hasDualZone: false, hasRearVents: false, dashboardStyle: 'sedan' },
];

export const MAKES = [...new Set(CARS.map((c) => c.make))];
