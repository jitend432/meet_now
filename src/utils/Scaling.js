import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const baseWidth = 375;

// 🔹 Scaling (fixed elements ke liye) 👉 avatar, icon, image
export const scale = (size) => (width / baseWidth) * size;


// 🔹 Width percentage (layout ke liye) 👉 container, card, banner
export const wp = (percent) =>  (width * percent) / 100;

// 🔹 Height percentage (layout ke liye)
export const hp = (percent) => (height * percent) / 100;


/*
import { scale, wp, hp } from '../utils/scaling';

const styles = {
  card: {
    width: wp(90),
    height: hp(40),
  },
  avatar: {
    width: scale(110),
    height: scale(110),
  }
};

 */