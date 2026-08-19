import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { updateProfileDraft } from '../../redux/slices/authSlice';
import { CustomModal } from '../../components/common/CustomModal';

const LANGUAGES_LIST = [
  // Indian Languages
  { label: 'Hindi', value: 'HINDI' },
  { label: 'Bengali', value: 'BENGALI' },
  { label: 'Telugu', value: 'TELUGU' },
  { label: 'Marathi', value: 'MARATHI' },
  { label: 'Tamil', value: 'TAMIL' },
  { label: 'Urdu', value: 'URDU' },
  { label: 'Gujarati', value: 'GUJARATI' },
  { label: 'Kannada', value: 'KANNADA' },
  { label: 'Malayalam', value: 'MALAYALAM' },
  { label: 'Odia', value: 'ODIA' },
  { label: 'Punjabi', value: 'PUNJABI' },
  { label: 'Assamese', value: 'ASSAMESE' },
  { label: 'Maithili', value: 'MAITHILI' },
  { label: 'Santali', value: 'SANTALI' },
  { label: 'Kashmiri', value: 'KASHMIRI' },
  { label: 'Nepali', value: 'NEPALI' },
  { label: 'Konkani', value: 'KONKANI' },
  { label: 'Sindhi', value: 'SINDHI' },
  { label: 'Dogri', value: 'DOGRI' },
  { label: 'Manipuri', value: 'MANIPURI' },
  { label: 'Bodo', value: 'BODO' },
  { label: 'Sanskrit', value: 'SANSKRIT' },

  // Global / European
  { label: 'English', value: 'ENGLISH' },
  { label: 'Spanish', value: 'SPANISH' },
  { label: 'French', value: 'FRENCH' },
  { label: 'German', value: 'GERMAN' },
  { label: 'Italian', value: 'ITALIAN' },
  { label: 'Portuguese', value: 'PORTUGUESE' },
  { label: 'Russian', value: 'RUSSIAN' },
  { label: 'Chinese', value: 'CHINESE' },
  { label: 'Japanese', value: 'JAPANESE' },
  { label: 'Korean', value: 'KOREAN' },
  { label: 'Arabic', value: 'ARABIC' },
  { label: 'Turkish', value: 'TURKISH' },
  { label: 'Dutch', value: 'DUTCH' },
  { label: 'Greek', value: 'GREEK' },
  { label: 'Hebrew', value: 'HEBREW' },
  { label: 'Swedish', value: 'SWEDISH' },
  { label: 'Norwegian', value: 'NORWEGIAN' },
  { label: 'Danish', value: 'DANISH' },
  { label: 'Finnish', value: 'FINNISH' },
  { label: 'Polish', value: 'POLISH' },
  { label: 'Czech', value: 'CZECH' },
  { label: 'Slovak', value: 'SLOVAK' },
  { label: 'Hungarian', value: 'HUNGARIAN' },
  { label: 'Romanian', value: 'ROMANIAN' },
  { label: 'Bulgarian', value: 'BULGARIAN' },
  { label: 'Ukrainian', value: 'UKRAINIAN' },
  { label: 'Serbian', value: 'SERBIAN' },
  { label: 'Croatian', value: 'CROATIAN' },
  { label: 'Slovenian', value: 'SLOVENIAN' },
  { label: 'Bosnian', value: 'BOSNIAN' },
  { label: 'Albanian', value: 'ALBANIAN' },
  { label: 'Icelandic', value: 'ICELANDIC' },
  { label: 'Irish', value: 'IRISH' },
  { label: 'Welsh', value: 'WELSH' },
  { label: 'Latvian', value: 'LATVIAN' },
  { label: 'Lithuanian', value: 'LITHUANIAN' },
  { label: 'Estonian', value: 'ESTONIAN' },

  // Asian & Others
  { label: 'Thai', value: 'THAI' },
  { label: 'Vietnamese', value: 'VIETNAMESE' },
  { label: 'Indonesian', value: 'INDONESIAN' },
  { label: 'Malay', value: 'MALAY' },
  { label: 'Filipino', value: 'FILIPINO' },
  { label: 'Burmese', value: 'BURMESE' },
  { label: 'Khmer', value: 'KHMER' },
  { label: 'Lao', value: 'LAO' },
  { label: 'Mongolian', value: 'MONGOLIAN' },
  { label: 'Tibetan', value: 'TIBETAN' },
  { label: 'Sinhala', value: 'SINHALA' },
  { label: 'Persian', value: 'PERSIAN' },
  { label: 'Pashto', value: 'PASHTO' },
  { label: 'Kurdish', value: 'KURDISH' },
  { label: 'Amharic', value: 'AMHARIC' },
  { label: 'Somali', value: 'SOMALI' },
  { label: 'Swahili', value: 'SWAHILI' },
  { label: 'Zulu', value: 'ZULU' },
  { label: 'Xhosa', value: 'XHOSA' },
  { label: 'Afrikaans', value: 'AFRIKAANS' },
  { label: 'Latin', value: 'LATIN' },
  { label: 'Esperanto', value: 'ESPERANTO' },
];

export default function LanguageSelectionScreen({ navigation }) {
  const dispatch = useAppDispatch();
  const existingDraft = useAppSelector((state) => state.auth.profileDraft || state.auth.user);

  const [selectedLanguages, setSelectedLanguages] = useState(
    existingDraft?.language || []
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Modal State
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'warning',
  });

  const hideModal = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  // Search Filter
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return LANGUAGES_LIST;
    const query = searchQuery.toLowerCase().trim();
    return LANGUAGES_LIST.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.value.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Toggle Language
  const handleToggleLanguage = (value) => {
    if (selectedLanguages.includes(value)) {
      setSelectedLanguages(selectedLanguages.filter((item) => item !== value));
    } else {
      setSelectedLanguages([...selectedLanguages, value]);
    }
  };

  // Handle Continue / Save
  const handleComplete = () => {
    if (selectedLanguages.length === 0) {
      setModalConfig({
        visible: true,
        title: 'Selection Required',
        message: 'Please select at least one language you speak.',
        type: 'warning',
      });
      return;
    }

    const languagePayload = {
      language: selectedLanguages,
    };

    dispatch(updateProfileDraft(languagePayload));
    navigation.navigate('LookingForScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Step Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>

        {/* Heading */}
        <Text style={styles.headingTitle}>
          What languages do{'\n'}you speak?
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitleText}>
          Select all languages you know (Choose at least one)
        </Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search languages..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Language Chips */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.chipWrapper}>
            {filteredLanguages.map((item) => {
              const isSelected = selectedLanguages.includes(item.value);
              return (
                <TouchableOpacity
                  key={item.value}
                  activeOpacity={0.7}
                  onPress={() => handleToggleLanguage(item.value)}
                  style={[
                    styles.chip,
                    isSelected && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {filteredLanguages.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No languages found</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Next Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleComplete}
          style={styles.floatingButton}
        >
          <Text style={styles.floatingButtonArrow}>›</Text>
        </TouchableOpacity>

        {/* Custom Error/Warning Modal */}
        <CustomModal
          visible={modalConfig.visible}
          onClose={hideModal}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          buttons={[
            {
              text: 'OK',
              onPress: hideModal,
              style: 'primary',
            },
          ]}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  progressBarFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
  },
  headingTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 0,
  },
  clearText: {
    fontSize: 14,
    color: '#8E8E93',
    paddingHorizontal: 4,
  },
  scrollContent: {
    paddingTop: 4,
    paddingBottom: 110,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: '#EAEAEA',
    borderColor: '#CCCCCC',
  },
  chipText: {
    fontSize: 14.5,
    color: '#333333',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  floatingButtonArrow: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: -3,
  },
});