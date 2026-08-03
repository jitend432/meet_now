import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const PlanCard = ({
  title,
  credits,
  price,
  period,
  features = [],
  isRecommended = false,
  onPress,
  icon,
}) => {
  return (
    <View style={[styles.cardContainer, isRecommended && styles.recommendedCard]}>
      {isRecommended && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECOMMENDED</Text>
        </View>
      )}

      <View style={styles.contentContainer}>
        {/* Icon Header */}
        <View style={styles.iconContainer}>{icon}</View>

        {/* Title & Credits */}
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.creditsText}>{credits}</Text>

        {/* Divider Line */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>

        {/* Price Tag */}
        <Text style={styles.priceText}>{price}</Text>
        <Text style={styles.periodText}>{period}</Text>

        {/* Features Checklist */}
        <View style={styles.featuresList}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={styles.checkIcon}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.featureText} numberOfLines={1}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Dynamic Styled Button */}
        <TouchableOpacity
          style={[styles.button, isRecommended ? styles.recommendedBtn : styles.standardBtn]}
          onPress={onPress}
        >
          <Text style={[styles.buttonText, isRecommended ? styles.recommendedBtnText : styles.standardBtnText]}>
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlanCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: width * 0.72,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    // borderWidth: 1,
    // borderColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#1B4D22',
    overflow: 'visible',
    paddingBottom: 20,
    marginTop: 15,
  },
  recommendedCard: {
    borderColor: '#1B4D22',
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#1B4D22',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 10,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 16,
    flex:1
  },
  iconContainer: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4D22',
  },
  creditsText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '600',
    marginTop: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8E6C9',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1B4D22',
    marginHorizontal: 6,
  },
  priceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1B4D22',
  },
  periodText: {
    fontSize: 13,
    color: '#666666',
    marginTop: -2,
    marginBottom: 15,
  },
  featuresList: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
    //height: 120, 
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1B4D22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  button: {
    width: '90%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginTop: 'auto'
  },
  standardBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1B4D22',
  },
  recommendedBtn: {
    backgroundColor: '#1B4D22',
    borderColor: '#1B4D22',
  },
  standardBtnText: {
    color: '#1B4D22',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recommendedBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});