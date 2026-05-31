import { ImageSourcePropType } from 'react-native';

const LOGOS: Record<string, ImageSourcePropType> = {
  Toyota:  require('../assets/images/brands/toyota.png'),
  Honda:   require('../assets/images/brands/honda.png'),
  Ford:    require('../assets/images/brands/ford.png'),
  Chevy:   require('../assets/images/brands/chevy.png'),
  Tesla:   require('../assets/images/brands/tesla.png'),
  BMW:     require('../assets/images/brands/bmw.png'),
  Subaru:  require('../assets/images/brands/subaru.png'),
  Hyundai: require('../assets/images/brands/hyundai.png'),
  Nissan:  require('../assets/images/brands/nissan.png'),
  Jeep:    require('../assets/images/brands/jeep.png'),
};

export function getBrandLogo(make: string): ImageSourcePropType | null {
  return LOGOS[make] ?? null;
}

export function hasBrandLogo(make: string): boolean {
  return make in LOGOS;
}
