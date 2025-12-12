import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isTablet = SCREEN_WIDTH >= 768;

import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const COUNTRY_CODES = [
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', phoneCode: '+7' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', phoneCode: '+7' },
  { code: 'US', name: 'United States', flag: '🇺🇸', phoneCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', phoneCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', phoneCode: '+34' },
  { code: 'CN', name: 'China', flag: '🇨🇳', phoneCode: '+86' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', phoneCode: '+81' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', phoneCode: '+82' },
  { code: 'IN', name: 'India', flag: '🇮🇳', phoneCode: '+91' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', phoneCode: '+55' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', phoneCode: '+61' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', phoneCode: '+90' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', phoneCode: '+380' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', phoneCode: '+375' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', phoneCode: '+998' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', phoneCode: '+996' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', phoneCode: '+992' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', phoneCode: '+993' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', phoneCode: '+994' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', phoneCode: '+374' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', phoneCode: '+995' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', phoneCode: '+48' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', phoneCode: '+420' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', phoneCode: '+43' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', phoneCode: '+41' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', phoneCode: '+31' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', phoneCode: '+46' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', phoneCode: '+47' },
];

export const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: 'KZ',
    gender: '' as '' | 'Male' | 'Female' | 'Other',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [countrySearch, setCountrySearch] = useState('');

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email format';
    if (!form.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(form.phoneNumber.replace(/\D/g, ''))) errors.phoneNumber = 'Invalid phone number';
    if (!form.gender) errors.gender = 'Gender is required';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFormProgress = () => {
    const fields = [form.firstName, form.lastName, form.email, form.phoneNumber, form.gender, form.password];
    const filledFields = fields.filter(field => field && field.trim()).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const submit = async () => {
    console.log('[RegisterScreen] Submit started, form data:', form);
    
    if (!validateForm()) {
      console.log('[RegisterScreen] Validation failed');
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    console.log('[RegisterScreen] Validation passed, submitting...');

    try {
      setLoading(true);
      // Get phone code from selected country
      const selectedCountry = COUNTRY_CODES.find(c => c.code === form.countryCode);
      const phoneCode = selectedCountry?.phoneCode || '+7';
      
      const payload = {
        ...form,
        countryCode: form.countryCode,
        phoneNumber: form.phoneNumber,
      };
      
      console.log('[RegisterScreen] Submitting payload:', payload);
      await signUp(payload);
      console.log('[RegisterScreen] Registration successful');
      navigation.navigate('Tabs');
    } catch (error) {
      console.error('[RegisterScreen] Registration error:', error);
      Alert.alert('Registration Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === form.countryCode);
  const progress = getFormProgress();

  const filteredCountries = COUNTRY_CODES.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.phoneCode.includes(countrySearch) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: theme.colors.glass }]}
          >
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.accentGlow }]}>
            <Feather name="user-plus" size={32} color={theme.colors.accent} />
          </View>
        </View>

        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
          Create Account
        </Text>
        <Text style={[styles.subheading, { color: theme.colors.textSecondary }]}>
          Sign up to get started
        </Text>

        {/* Progress Bar */}
        <View style={[styles.progressContainer, { backgroundColor: theme.colors.glass }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${progress}%`,
                backgroundColor: theme.colors.accent 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textMuted }]}>
          {progress}% Complete
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {/* First Name */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              First Name <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, { borderColor: validationErrors.firstName ? '#EF4444' : theme.colors.borderLight }]}>
              <Feather name="user" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                value={form.firstName}
                onChangeText={(value) => {
                  setForm((prev) => ({ ...prev, firstName: value }));
                  if (validationErrors.firstName) {
                    setValidationErrors(prev => ({ ...prev, firstName: '' }));
                  }
                }}
                placeholder="Enter first name"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="words"
              />
            </View>
            {validationErrors.firstName && (
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{validationErrors.firstName}</Text>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Last Name <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, { borderColor: validationErrors.lastName ? '#EF4444' : theme.colors.borderLight }]}>
              <Feather name="user" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                value={form.lastName}
                onChangeText={(value) => {
                  setForm((prev) => ({ ...prev, lastName: value }));
                  if (validationErrors.lastName) {
                    setValidationErrors(prev => ({ ...prev, lastName: '' }));
                  }
                }}
                placeholder="Enter last name"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="words"
              />
            </View>
            {validationErrors.lastName && (
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{validationErrors.lastName}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Email <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, { borderColor: validationErrors.email ? '#EF4444' : theme.colors.borderLight }]}>
              <Feather name="mail" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                value={form.email}
                onChangeText={(value) => {
                  setForm((prev) => ({ ...prev, email: value }));
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {validationErrors.email && (
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{validationErrors.email}</Text>
            )}
          </View>

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Phone Number <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={styles.phoneContainer}>
              <TouchableOpacity
                onPress={() => setShowCountryPicker(!showCountryPicker)}
                style={[styles.countryCodeButton, { borderColor: theme.colors.borderLight, backgroundColor: theme.colors.glass }]}
              >
                <Text style={styles.countryFlag}>{selectedCountry?.flag || '🇰🇿'}</Text>
                <Text style={[styles.countryCode, { color: theme.colors.textPrimary }]}>
                  {selectedCountry?.phoneCode || '+7'}
                </Text>
                <Feather name={showCountryPicker ? "chevron-up" : "chevron-down"} size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
              <View style={[styles.phoneInputWrapper, { borderColor: validationErrors.phoneNumber ? '#EF4444' : theme.colors.borderLight }]}>
                <Feather name="phone" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.textPrimary }]}
                  value={form.phoneNumber}
                  onChangeText={(value) => {
                    setForm((prev) => ({ ...prev, phoneNumber: value }));
                    if (validationErrors.phoneNumber) {
                      setValidationErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }
                  }}
                  placeholder="1234567890"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            {showCountryPicker && (
              <View style={[styles.countryPicker, { backgroundColor: theme.colors.card, borderColor: theme.colors.borderLight }]}>
                <View style={[styles.countrySearchContainer, { borderBottomColor: theme.colors.borderLight }]}>
                  <Feather name="search" size={18} color={theme.colors.textMuted} />
                  <TextInput
                    style={[styles.countrySearchInput, { color: theme.colors.textPrimary }]}
                    placeholder="Search country or code..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={countrySearch}
                    onChangeText={setCountrySearch}
                    autoCapitalize="none"
                  />
                  {countrySearch.length > 0 && (
                    <TouchableOpacity onPress={() => setCountrySearch('')}>
                      <Feather name="x" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView style={styles.countryList} nestedScrollEnabled>
                  {filteredCountries.length === 0 ? (
                    <Text style={[styles.noResultsText, { color: theme.colors.textMuted }]}>
                      No countries found
                    </Text>
                  ) : (
                    filteredCountries.map((country) => (
                      <TouchableOpacity
                        key={country.code}
                        onPress={() => {
                          setForm(prev => ({ ...prev, countryCode: country.code }));
                          setShowCountryPicker(false);
                          setCountrySearch('');
                        }}
                        style={[
                          styles.countryOption,
                          { borderBottomColor: theme.colors.borderLight },
                          form.countryCode === country.code && { backgroundColor: theme.colors.accentGlow }
                        ]}
                      >
                        <Text style={styles.countryFlag}>{country.flag}</Text>
                        <View style={styles.countryInfo}>
                          <Text style={[styles.countryOptionText, { color: theme.colors.textPrimary }]}>
                            {country.name}
                          </Text>
                          <Text style={[styles.countryOptionCode, { color: theme.colors.textSecondary }]}>
                            {country.phoneCode}
                          </Text>
                        </View>
                        {form.countryCode === country.code && (
                          <Feather name="check" size={18} color={theme.colors.accent} />
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            )}
            {validationErrors.phoneNumber && (
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{validationErrors.phoneNumber}</Text>
            )}
          </View>

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Gender <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[
              styles.genderContainer,
              validationErrors.gender && { borderColor: '#EF4444', borderWidth: 1.5, borderRadius: 14, padding: 4 }
            ]}>
              {(['Male', 'Female', 'Other'] as const).map((gender) => (
                <TouchableOpacity
                  key={gender}
                  onPress={() => {
                    setForm(prev => ({ ...prev, gender }));
                    if (validationErrors.gender) {
                      setValidationErrors(prev => ({ ...prev, gender: '' }));
                    }
                  }}
                  style={[
                    styles.genderButton,
                    { borderColor: theme.colors.borderLight },
                    form.gender === gender && { 
                      borderColor: theme.colors.accent, 
                      backgroundColor: theme.colors.accentGlow 
                    }
                  ]}
                >
                  <Feather 
                    name={gender === 'Male' ? 'user' : gender === 'Female' ? 'user' : 'users'} 
                    size={20} 
                    color={form.gender === gender ? theme.colors.accent : theme.colors.textMuted} 
                  />
                  <Text style={[
                    styles.genderText,
                    { color: theme.colors.textPrimary },
                    form.gender === gender && { color: theme.colors.accent }
                  ]}>
                    {gender}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {validationErrors.gender && (
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{validationErrors.gender}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Password <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={[styles.inputWrapper, { borderColor: validationErrors.password ? '#EF4444' : theme.colors.borderLight }]}>
              <Feather name="lock" size={20} color={theme.colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                value={form.password}
                onChangeText={(value) => {
                  setForm((prev) => ({ ...prev, password: value }));
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                placeholder="Enter password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
              />
            </View>
            {validationErrors.password && (
              <Text style={[styles.errorText, { color: '#EF4444' }]}>{validationErrors.password}</Text>
            )}
            <Text style={[styles.helperText, { color: theme.colors.textMuted }]}>
              Must be at least 6 characters
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <PrimaryButton 
          label="Create Account" 
          onPress={submit} 
          loading={loading}
          icon={<Feather name="user-check" size={18} color="#0d1b2a" />}
        />

        {/* Login Link */}
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
        Already have an account?{' '}
          <Text 
            style={{ color: theme.colors.accent, fontWeight: '700' }} 
            onPress={() => navigation.navigate('Login')}
          >
          Sign In
        </Text>
      </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: { 
    padding: isTablet ? 40 : isSmallDevice ? 16 : 20,
    paddingHorizontal: isTablet ? Math.min(SCREEN_WIDTH * 0.2, 200) : (isSmallDevice ? 16 : 20),
    gap: isSmallDevice ? 12 : 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  backButton: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: isSmallDevice ? 20 : 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: isSmallDevice ? 56 : isTablet ? 80 : 64,
    height: isSmallDevice ? 56 : isTablet ? 80 : 64,
    borderRadius: isSmallDevice ? 28 : isTablet ? 40 : 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  heading: { 
    fontSize: isSmallDevice ? 26 : isTablet ? 40 : 32,
    fontWeight: '900',
    letterSpacing: -0.8,
    textAlign: 'center',
    marginBottom: 4,
  },
  subheading: {
    fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16,
    textAlign: 'center',
    marginBottom: isSmallDevice ? 16 : 20,
  },
  progressContainer: {
    height: isSmallDevice ? 5 : 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: isSmallDevice ? 11 : 12,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: isSmallDevice ? 10 : 12,
  },
  form: {
    gap: isSmallDevice ? 16 : isTablet ? 24 : 20,
  },
  fieldContainer: {
    gap: isSmallDevice ? 6 : 8,
  },
  label: { 
    fontSize: isSmallDevice ? 13 : isTablet ? 15 : 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: isTablet ? 16 : 14,
    paddingHorizontal: isSmallDevice ? 12 : 14,
    height: isSmallDevice ? 48 : isTablet ? 56 : 52,
  },
  inputIcon: {
    marginRight: isSmallDevice ? 8 : 10,
  },
  input: { 
    flex: 1,
    fontSize: isSmallDevice ? 15 : isTablet ? 17 : 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '500',
    marginTop: -4,
  },
  helperText: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '500',
    marginTop: -4,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: isSmallDevice ? 6 : 8,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 4 : 6,
    paddingHorizontal: isSmallDevice ? 10 : 12,
    borderWidth: 1.5,
    borderRadius: isTablet ? 16 : 14,
    height: isSmallDevice ? 48 : isTablet ? 56 : 52,
    minWidth: isSmallDevice ? 90 : 100,
  },
  countryFlag: {
    fontSize: isSmallDevice ? 18 : 20,
  },
  countryCode: {
    fontSize: isSmallDevice ? 14 : isTablet ? 18 : 16,
    fontWeight: '700',
  },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: isTablet ? 16 : 14,
    paddingHorizontal: isSmallDevice ? 12 : 14,
    height: isSmallDevice ? 48 : isTablet ? 56 : 52,
  },
  countryPicker: {
    borderRadius: isTablet ? 16 : 14,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginTop: 4,
    maxHeight: isTablet ? 400 : isSmallDevice ? 250 : 300,
  },
  countrySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 8 : 10,
    paddingHorizontal: isSmallDevice ? 12 : 14,
    paddingVertical: isSmallDevice ? 10 : 12,
    borderBottomWidth: 1,
  },
  countrySearchInput: {
    flex: 1,
    fontSize: isSmallDevice ? 14 : isTablet ? 16 : 15,
    fontWeight: '500',
  },
  countryList: {
    maxHeight: isTablet ? 340 : isSmallDevice ? 190 : 240,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '500',
    paddingVertical: 20,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 10 : 12,
    paddingVertical: isSmallDevice ? 10 : isTablet ? 14 : 12,
    paddingHorizontal: isSmallDevice ? 12 : 14,
    borderBottomWidth: 0.5,
  },
  countryInfo: {
    flex: 1,
    gap: 2,
  },
  countryOptionText: {
    fontSize: isSmallDevice ? 14 : isTablet ? 16 : 15,
    fontWeight: '600',
  },
  countryOptionCode: {
    fontSize: isSmallDevice ? 11 : isTablet ? 13 : 12,
    fontWeight: '500',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: isSmallDevice ? 6 : 8,
  },
  genderButton: {
    flex: 1,
    flexDirection: isSmallDevice ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: isSmallDevice ? 4 : 8,
    paddingVertical: isSmallDevice ? 12 : isTablet ? 16 : 14,
    borderRadius: isTablet ? 16 : 14,
    borderWidth: 1.5,
  },
  genderText: {
    fontSize: isSmallDevice ? 12 : isTablet ? 16 : 14,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    fontSize: isSmallDevice ? 13 : isTablet ? 16 : 14,
    marginTop: 8,
  },
});
