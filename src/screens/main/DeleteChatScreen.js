import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import CardContainer from '../../components/chat/CardContainer';
import Button from '../../components/common/Button'; 
import { COLORS } from '../../constants/theme';

const DeleteChatScreen = ({ navigation }) => {
  
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteExecute = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsDeletedSuccess(true); 
    }, 800);
  };

  const handleFinalDismiss = () => {
    setIsDeletedSuccess(false);
    navigation?.goBack(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CardContainer title="Hexa Dating">
        <View style={styles.contentContainer}>
          
        
          <View style={styles.dialogCardFrame}>
            
            <View style={styles.cardHeaderRow}>
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => navigation?.goBack()}
                style={styles.backButtonTrigger}
              >
                <FontAwesomeFreeSolid name="arrow-left" size={16} color="#0B5324" />
              </TouchableOpacity>
              <Text style={styles.headerTitleText}>
                {isDeletedSuccess ? "Chat Deleted" : "Delete Chat"}
              </Text>
              <View style={styles.headerPlaceholderBox} />
            </View>

            {!isDeletedSuccess ? (
              <View style={styles.innerCardWrapper}>
                <View style={styles.cardInnerBody}>
                  <View style={styles.iconCircleBadgeDanger}>
                    <FontAwesomeFreeSolid name="trash-alt" size={32} color="#b71c1c" />
                  </View>

                  <Text style={styles.warningHeadlineText}>Delete this conversation?</Text>
                  <Text style={styles.warningDescriptionText}>
                    This will remove the chat from your message list.
                  </Text>
                </View>

                <View style={styles.actionButtonsRow}>
                  <Button 
                    title="Cancel" 
                    variant="cancel" 
                    onPress={() => navigation?.goBack()} 
                    style={styles.flexButtonSpacing}
                  />
                  <Button 
                    title="Delete Chat" 
                    variant="danger" 
                    loading={isLoading}
                    onPress={handleDeleteExecute} 
                    style={styles.flexButton}
                  />
                </View>
              </View>
            ) : (
            
              <View style={styles.innerCardWrapper}>
                <View style={styles.cardInnerBody}>
                  <View style={styles.iconCircleBadgeSuccess}>
                    <FontAwesomeFreeSolid name="check" size={32} color="#0b5324" />
                  </View>

                  <Text style={styles.successDescriptionText}>
                    This conversation has been deleted.
                  </Text>
                </View>

                <View style={styles.actionButtonsRow}>
                  <Button 
                    title="OK" 
                    variant="primary"
                    onPress={handleFinalDismiss} 
                    style={styles.flexButton}
                  />
                </View>
              </View>
            )}

          </View>

        </View>
      </CardContainer>
    </SafeAreaView>
  );
};

export default DeleteChatScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS?.background || '#9c6644', 
    paddingBottom: 60,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dialogCardFrame: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 24,
  },
  backButtonTrigger: {
    padding: 4,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B5324',
    textAlign: 'center',
  },
  headerPlaceholderBox: {
    width: 24,
  },
  innerCardWrapper: {
    width: '100%',
  },
  cardInnerBody: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 32,
  },
  iconCircleBadgeDanger: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircleBadgeSuccess: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e8f5e9', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  warningHeadlineText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 14,
  },
  warningDescriptionText: {
    fontSize: 14,
    color: '#616161',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  successDescriptionText: {
    fontSize: 15,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  flexButton: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
    borderRadius: 12,
  },
  flexButtonSpacing: {
    flex: 1,
    height: 48,
    paddingVertical: 0,
    marginRight: 12,
    borderRadius: 12,
  },
});