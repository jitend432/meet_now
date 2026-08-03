import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

const ProcessStepItem = ({ title, subtitle, status, isLast, isActiveStep }) => {
  // Status types: 'completed', 'active', 'pending'
  
  // Scale animation for the active step pulse effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status === 'active') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [status]);

  const renderIndicator = () => {
    if (status === 'completed') {
      return (
        <View style={[styles.circle, styles.circleCompleted]}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      );
    } else if (status === 'active') {
      return (
        <Animated.View style={[styles.circle, styles.circleActive, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.circleActiveInner} />
        </Animated.View>
      );
    } else {
      return <View style={[styles.circle, styles.circlePending]} />;
    }
  };

  return (
    <View style={styles.rowContainer}>
      {/* Left Timeline Indicator & Animated Line Column */}
      <View style={styles.leftColumn}>
        {renderIndicator()}
        {!isLast && (
          <View style={styles.lineTrackBase}>
            {/* Background trace line (gray placeholder) */}
            <View style={styles.staticLineBackground} />
            
            {/* Foreground filling line (green active indicator) */}
            {status === 'completed' && <View style={[styles.staticLineBackground, styles.lineCompletedFull]} />}
            {isActiveStep && (
              <Animated.View 
                style={[
                  styles.animatedLineFill, 
                  {
                    height: isActiveStep.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                  }
                ]} 
              />
            )}
          </View>
        )}
      </View>

      {/* Right Description Content Column */}
      <View style={styles.rightColumn}>
        <Text style={[styles.stepTitle, status === 'pending' && styles.textPending]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.stepSubtitle, status === 'pending' && styles.textPending]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export default ProcessStepItem;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    minHeight: 90,
  },
  leftColumn: {
    alignItems: 'center',
    marginRight: 16,
    width: 24,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  circleCompleted: {
    backgroundColor: '#1B4D22',
  },
  circleActive: {
    borderWidth: 2,
    borderColor: '#1B4D22',
    backgroundColor: '#FFFFFF',
  },
  circleActiveInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1B4D22',
  },
  circlePending: {
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: -1,
  },
  lineTrackBase: {
    position: 'absolute',
    top: 24,
    bottom: -10,
    width: 3,
    alignItems: 'center',
    zIndex: 1,
  },
  staticLineBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#E2E8F0', // Gray placeholder path
  },
  lineCompletedFull: {
    backgroundColor: '#1B4D22',
  },
  animatedLineFill: {
    position: 'absolute',
    top: 0,
    width: 3,
    backgroundColor: '#1B4D22', // Green progress highlight tracking line
  },
  rightColumn: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4D22',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#4E6E52',
    lineHeight: 18,
  },
  textPending: {
    color: '#718096',
  },
});