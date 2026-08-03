import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TransactionHistoryItem from '../../components/common/TransactionHistoryItem';
import { paymentApi } from '../../services/paymentApi'; // Switched to paymentApi

const TransactionHistoryScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  // Fetch data from payment API
  const fetchTransactionHistory = async (page = 0, isRefreshing = false) => {
    try {
      if (page === 0) {
        if (!isRefreshing) setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // API invocation using paymentApi
      const response = await paymentApi.getTransactionHistory(page, PAGE_SIZE);
      
      // Handles different backend wrapper response designs safely
      const freshData = response?.data || response?.content || response || [];

      if (isRefreshing || page === 0) {
        setTransactions(freshData);
      } else {
        setTransactions((prev) => [...prev, ...freshData]);
      }

      // Check if we hit the end of the data list
      if (freshData.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial mount hook
  useEffect(() => {
    fetchTransactionHistory(0);
  }, []);

  // Pull-to-refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    setPageNo(0);
    fetchTransactionHistory(0, true);
  };

  // Infinite scroll loader triggered near page bottom limits
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = pageNo + 1;
      setPageNo(nextPage);
      fetchTransactionHistory(nextPage);
    }
  };

  // Human-readable date standard parser
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Capitalize status string cleanly
  const formatStatus = (status) => {
    if (!status) return 'Paid';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Formats currency nicely
  const formatAmount = (amount, currency = '$') => {
    if (typeof amount === 'string' && amount.includes('$')) return amount;
    return `${currency}${Number(amount || 0).toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Navigation Controls */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentBody}>
        <Text style={styles.mainTitle}>Transaction History</Text>

        {loading ? (
          <View style={styles.centerSpinner}>
            <ActivityIndicator size="large" color="#1B4D22" />
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <TransactionHistoryItem
                title={item.planName || item.title || 'Basic Plan - Monthly'}
                date={formatDate(item.createdAt || item.date || item.transactionDate)}
                amount={formatAmount(item.amount || item.price)}
                status={formatStatus(item.status)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listScrollContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh} 
                colors={['#1B4D22']}
                tintColor="#1B4D22" 
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transaction records available.</Text>
              </View>
            }
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#1B4D22" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default TransactionHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCE6', 
  },
  headerBar: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  backIcon: {
    fontSize: 24,
    color: '#1B4D22',
    fontWeight: '600',
  },
  contentBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B4D22',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  listScrollContent: {
    paddingBottom: 24,
  },
  centerSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#4E6E52',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});