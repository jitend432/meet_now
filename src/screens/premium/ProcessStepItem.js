import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProcessStepItem = ({ title, subtitle, status, isLast }) => {
  // Statuses: 'completed', 'active', 'pending'
  
  const renderIndicator = () => {
    if (status === 'completed') {
      return (
        <View style={[styles.circle, styles.circleCompleted]}>
          <Text style={styles.checkMark}>✓</Text>
        </View>
      );
    } else if (status === 'active') {
      return (
        <View style={[styles.circle, styles.circleActive]}>
          <View style={styles.circleActiveInner} />
        </View>
      );
    } else {
      return <View style={[styles.circle, styles.circlePending]} />;
    }
  };

  return (
    <View style={styles.rowContainer}>
      {/* Left Timeline Indicator & Vertical Line Column */}
      <View style={styles.leftColumn}>
        {renderIndicator()}
        {!isLast && (
          <View 
            style={[
              styles.verticalLine, 
              status === 'completed' ? styles.lineCompleted : styles.linePending
            ]} 
          />
        )}
      </View>

      {/* Right Context Content Column */}
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
    minHeight: 80,
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
    zIndex: 2,
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
  verticalLine: {
    position: 'absolute',
    top: 24,
    bottom: -10,
    width: 3,
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: '#1B4D22',
  },
  linePending: {
    backgroundColor: '#CBD5E1',
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