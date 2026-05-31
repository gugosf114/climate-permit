import { ImageSourcePropType } from 'react-native';

const VEHICLES: Record<string, ImageSourcePropType> = {
  'Toyota|RAV4':              require('../assets/images/vehicles/toyota-rav4.png'),
  'Toyota|Camry':             require('../assets/images/vehicles/toyota-camry.png'),
  'Toyota|Corolla':           require('../assets/images/vehicles/toyota-corolla.png'),
  'Toyota|Tacoma':            require('../assets/images/vehicles/toyota-tacoma.png'),
  'Honda|Civic':              require('../assets/images/vehicles/honda-civic.png'),
  'Honda|CR-V':               require('../assets/images/vehicles/honda-crv.png'),
  'Honda|Accord':             require('../assets/images/vehicles/honda-accord.png'),
  'Honda|Pilot':              require('../assets/images/vehicles/honda-pilot.png'),
  'Ford|F-150':               require('../assets/images/vehicles/ford-f150.png'),
  'Ford|Explorer':            require('../assets/images/vehicles/ford-explorer.png'),
  'Ford|Bronco':              require('../assets/images/vehicles/ford-bronco.png'),
  'Chevy|Silverado':          require('../assets/images/vehicles/chevy-silverado.png'),
  'Chevy|Equinox':            require('../assets/images/vehicles/chevy-equinox.png'),
  'Chevy|Tahoe':              require('../assets/images/vehicles/chevy-tahoe.png'),
  'Tesla|Model 3':            require('../assets/images/vehicles/tesla-model3.png'),
  'Tesla|Model Y':            require('../assets/images/vehicles/tesla-modely.png'),
  'BMW|3-Series':             require('../assets/images/vehicles/bmw-3series.png'),
  'BMW|X3':                   require('../assets/images/vehicles/bmw-x3.png'),
  'Subaru|Outback':           require('../assets/images/vehicles/subaru-outback.png'),
  'Subaru|Forester':          require('../assets/images/vehicles/subaru-forester.png'),
  'Hyundai|Tucson':           require('../assets/images/vehicles/hyundai-tucson.png'),
  'Hyundai|Elantra':          require('../assets/images/vehicles/hyundai-elantra.png'),
  'Nissan|Rogue':             require('../assets/images/vehicles/nissan-rogue.png'),
  'Nissan|Altima':            require('../assets/images/vehicles/nissan-altima.png'),
  'Jeep|Wrangler':            require('../assets/images/vehicles/jeep-wrangler.png'),
  'Jeep|Grand Cherokee':      require('../assets/images/vehicles/jeep-grandcherokee.png'),
  'Generic|Not Listed':       require('../assets/images/vehicles/generic.png'),
};

export function getVehicleImage(make: string, model: string): ImageSourcePropType {
  const key = `${make}|${model}`;
  return VEHICLES[key] ?? VEHICLES['Generic|Not Listed'];
}
