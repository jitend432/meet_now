import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const TransactionHistoryItem = ({ title, date, amount, status }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.leftContent}>
        {/* Document/Receipt Circular Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.documentIcon}>📄</Text>
        </View>
        
        {/* Transaction Text Metadata */}
        <View style={styles.textWrapper}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>

      {/* Financial Figure Details */}
      <View style={styles.rightContent}>
        <Text style={styles.amountText}>{amount}</Text>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
};

export default TransactionHistoryItem;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1B4D22', // Pure brand forest green background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  documentIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  textWrapper: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4D22',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  rightContent: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B4D22',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    color: '#4E6E52',
    fontWeight: '600',
  },
});