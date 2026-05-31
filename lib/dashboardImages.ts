import { ImageSourcePropType } from 'react-native';

const DASHBOARDS: Record<string, ImageSourcePropType> = {
  Toyota:  require('../assets/images/dashboards/toyota.png'),
  Honda:   require('../assets/images/dashboards/honda.png'),
  Ford:    require('../assets/images/dashboards/ford.png'),
  Chevy:   require('../assets/images/dashboards/chevy.png'),
  Tesla:   require('../assets/images/dashboards/tesla.png'),
  BMW:     require('../assets/images/dashboards/bmw.png'),
  Subaru:  require('../assets/images/dashboards/subaru.png'),
  Hyundai: require('../assets/images/dashboards/hyundai.png'),
  Nissan:  require('../assets/images/dashboards/nissan.png'),
  Jeep:    require('../assets/images/dashboards/jeep.png'),
  Generic: require('../assets/images/dashboards/generic.png'),
};

export function getDashboardImage(make: string): ImageSourcePropType {
  return DASHBOARDS[make] ?? DASHBOARDS.Generic;
}
