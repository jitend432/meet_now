import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Image, 
  StatusBar,
  TouchableOpacity,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTSIZE } from '../../constants/theme';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_t.png';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { FONTS } from '../../constants/fonts';

const EmailSuccessScreen = ({ navigation }) => {
  const handleAgree = () => {
    navigation.navigate('BasicInfoScreen');
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      {/* Top Close Button */}
      <View style={styles.topBar}>
        {/* <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <FontAwesomeFreeSolid name="xmark" size={20} color="#656E7B" />
        </TouchableOpacity> */}
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoRow}>
          <Image 
            source={LogoImage} 
            style={styles.logoStyle} 
            resizeMode="contain" 
          />
        </View>

        {/* Title and Subtitle */}
        <Text style={styles.mainTitle}>Welcome to Vynk.</Text>
        <Text style={styles.subtitle}>Please follow these House Rules.</Text>

        {/* Rules Section */}
        <View style={styles.rulesContainer}>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleTitle}>Be yourself.</Text>
            <Text style={styles.ruleDescription}>
              Make sure your photos, age, and bio are true to who you are.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={styles.ruleTitle}>Stay safe.</Text>
            <Text style={styles.ruleDescription}>
              Don't be too quick to give out personal information.{' '}
              <Text 
                style={styles.linkText}
                 onPress={() => Linking.openURL('https://vynkdating.com/child-safety-standards')}
              >
                Data Safely
              </Text>
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={styles.ruleTitle}>Play it cool.</Text>
            <Text style={styles.ruleDescription}>
              Respect others and treat them as you would like to be treated.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={styles.ruleTitle}>Be proactive.</Text>
            <Text style={styles.ruleDescription}>
              Always report bad behavior.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Button 
          title="I agree" 
          onPress={handleAgree} 
          style={styles.agreeButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default EmailSuccessScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justify: 'center',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 100, 
  },
  logoRow: {
    marginBottom: 16,
  },
  logoStyle: {
    width: 70,
    height: 70,
  },
  mainTitle: {
    fontSize: FONTSIZE.h3,
    color: COLORS.button,
    marginBottom: 2,
    fontFamily: FONTS.SEMIBOLD,
  },
  subtitle: {
    fontSize: 17,
    color: '#7DAF93',
    marginBottom: 22,
    fontFamily: FONTS.REGULAR,
  },
  rulesContainer: {
    gap: 24,
  },
  ruleItem: {
    marginBottom: 2,
  },
  ruleTitle: {
    fontSize: 18,
   // fontWeight: '700',
    color: COLORS.button,
    marginBottom: 4,
    fontFamily: FONTS.MEDIUM,
  },
  ruleDescription: {
    fontSize: 16,
    color: '#7DAF93',
    lineHeight: 19,
    fontFamily: FONTS.REGULAR,
  },
  linkText: {
    color: '#2078F4',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: COLORS.white,
  },
  agreeButton: {
    width: '100%',
    backgroundColor: COLORS.button,
    borderRadius: 30,
    height: 52,
    marginBottom: 30
  },
});