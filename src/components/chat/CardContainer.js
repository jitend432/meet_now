import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
//import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { FONTS } from '../../constants/fonts';
import { COLORS, FONTSIZE, SIZES } from '../../constants/theme';
import LogoImage from '../../assets/images/vynk_t.png';

const CardContainer = ({ children, style, showHeader = true, title = "Vynk Dating" }) => {
  return (
    <View style={[styles.card, style]}>
      {/* Universal Header - Automatically rendered if showHeader is true */}
      {showHeader && (
        <View style={styles.brandHeader}>
          <View style={styles.brandIconShape}>
            <Image source={LogoImage} style={styles.logoStyle} resizeMode="center" />
          </View>
          {/* <Text style={styles.brandTitle}>{title}</Text> */}
        </View>
      )}
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

export default CardContainer;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background, 
    //borderTopLeftRadius: 28,
    //borderTopRightRadius: 28,
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  logoStyle: {
    width: SIZES.avatarmini,
    height: SIZES.avatarmini,
  },
  brandHeader: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1d9b7',
    backgroundColor: COLORS.background,
  },
  brandIconShape: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    //alignItems: 'flex-start',
    //marginRight: 10,
    //padding:12
  },
  brandTitle: {
    fontSize: FONTSIZE.xl,
    color: '#265c32',
    letterSpacing: 0.3,
    fontFamily: FONTS.SEMIBOLD
  },
  content: {
    flex: 1,
  },
});