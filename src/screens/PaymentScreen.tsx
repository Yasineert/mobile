import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../theme/theme';
import { paymentService, PaymentData, PaymentResponse } from '../services/paymentService';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'gpay' | 'applepay' | 'pass';
  isSelected?: boolean;
}

interface PaymentScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

interface ValidationState {
  firstName: boolean;
  lastName: boolean;
  cardNumber: boolean;
  securityCode: boolean;
  expiryDate: boolean;
}

const PaymentScreen = ({ navigation }: PaymentScreenProps) => {
  const [activeTab, setActiveTab] = useState('payment');
  const [firstName, setFirstName] = useState('Mohammed');
  const [lastName, setLastName] = useState('Alaoui');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [securityCode, setSecurityCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    firstName: true,
    lastName: true,
    cardNumber: true,
    securityCode: true,
    expiryDate: true,
  });
  const [paymentReference, setPaymentReference] = useState('');

  const paymentMethods: PaymentMethod[] = [
    { id: '1', name: 'Pass', type: 'pass', isSelected: false },
    { id: '2', name: 'Card', type: 'card', isSelected: true },
    { id: '3', name: 'G Pay', type: 'gpay', isSelected: false },
    { id: '4', name: 'Apple Pay', type: 'applepay', isSelected: false },
  ];

  const formatCardNumber = (text: string) => {
    const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    if (isSubmitted) {
      validateField('cardNumber', formatted);
    }
  };

  const formatExpiryDate = (text: string) => {
    // Format expiry date as MM/YY
    text = text.replace(/\D/g, '');
    if (text.length > 2) {
      text = text.substring(0, 2) + '/' + text.substring(2, 4);
    }
    setExpiryDate(text);
    if (isSubmitted) {
      validateField('expiryDate', text);
    }
  };

  const validateField = (field: keyof ValidationState, value: string): boolean => {
    let isValid = true;
    const errors: Record<string, string> = { ...validationErrors };

    switch (field) {
      case 'firstName':
        isValid = value.length >= 2;
        if (!isValid) errors.firstName = 'First name must be at least 2 characters';
        else delete errors.firstName;
        break;
      case 'lastName':
        isValid = value.length >= 2;
        if (!isValid) errors.lastName = 'Last name must be at least 2 characters';
        else delete errors.lastName;
        break;
      case 'cardNumber':
        isValid = value.replace(/\s/g, '').length >= 13;
        if (!isValid) errors.cardNumber = 'Please enter a valid card number';
        else delete errors.cardNumber;
        break;
      case 'securityCode':
        isValid = /^\d{3,4}$/.test(value);
        if (!isValid) errors.securityCode = 'CVC must be 3-4 digits';
        else delete errors.securityCode;
        break;
      case 'expiryDate':
        isValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value);
        if (!isValid) errors.expiryDate = 'Format must be MM/YY';
        else delete errors.expiryDate;
        break;
    }

    setValidationErrors(errors);
    setValidation(prev => ({ ...prev, [field]: isValid }));
    return isValid;
  };

  const validateForm = (): boolean => {
    const firstNameValid = validateField('firstName', firstName);
    const lastNameValid = validateField('lastName', lastName);
    const cardNumberValid = validateField('cardNumber', cardNumber);
    const securityCodeValid = validateField('securityCode', securityCode);
    const expiryDateValid = validateField('expiryDate', expiryDate);

    return firstNameValid && lastNameValid && cardNumberValid && securityCodeValid && expiryDateValid;
  };

  const handlePayment = async () => {
    setIsSubmitted(true);
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const paymentData: PaymentData = {
        firstName,
        lastName,
        cardNumber,
        cvc: securityCode,
        expiryDate,
        amount: 15.00,
        paymentMethod: selectedPaymentMethod,
      };

      const response = await paymentService.createPayment(paymentData);
      
      if (response.success) {
        // Generate a random payment reference
        const reference = `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        setPaymentReference(reference);
        setSuccessModal(true);
        
        // Reset form after successful payment
        setSecurityCode('');
        setExpiryDate('');
        setTimeout(() => {
          setSuccessModal(false);
        }, 5000); // Close after 5 seconds
      } else {
        // Handle server-side validation errors
        if (response.data && response.data.errors) {
          const serverErrors = response.data.errors;
          const errorObj: Record<string, string> = {};
          
          // Map server errors to form fields
          Object.keys(serverErrors).forEach(key => {
            errorObj[key] = serverErrors[key];
          });
          
          setValidationErrors({...validationErrors, ...errorObj});
        } else {
          Alert.alert('Error', response.message || 'Payment failed');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing payment');
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Success Modal */}
      <Modal
        visible={successModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MaterialIcons name="check-circle" size={60} color="#4CAF50" />
            <Text style={styles.modalTitle}>Payment Confirmed</Text>
            <Text style={styles.modalText}>Your payment has been processed successfully.</Text>
            <Text style={styles.paymentReference}>Reference: {paymentReference}</Text>
            <View style={styles.confirmationDetails}>
              <Text style={styles.confirmationText}>Amount: 15 MAD</Text>
              <Text style={styles.confirmationText}>Method: {selectedPaymentMethod}</Text>
              <Text style={styles.confirmationText}>Card: xxxx xxxx xxxx {cardNumber.slice(-4)}</Text>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Payment Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment information</Text>
          
          {/* Payment Method Selection */}
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity 
                key={method.id}
                style={[
                  styles.paymentMethodButton,
                  method.type === selectedPaymentMethod && styles.selectedPaymentMethod
                ]}
                onPress={() => setSelectedPaymentMethod(method.type)}
              >
                {method.type === 'pass' && <Icon name="ticket-outline" size={20} color={method.type === selectedPaymentMethod ? '#fff' : '#333'} />}
                {method.type === 'card' && <Icon name="card-outline" size={20} color={method.type === selectedPaymentMethod ? '#fff' : '#333'} />}
                {method.type === 'gpay' && <FontAwesome name="google" size={20} color={method.type === selectedPaymentMethod ? '#fff' : '#333'} />}
                {method.type === 'applepay' && <FontAwesome name="apple" size={20} color={method.type === selectedPaymentMethod ? '#fff' : '#333'} />}
                <Text style={[
                  styles.paymentMethodText,
                  method.type === selectedPaymentMethod && styles.selectedPaymentMethodText
                ]}>{method.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Card Information Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>First name</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isSubmitted && !validation.firstName && styles.inputError
                  ]}
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    if (isSubmitted) {
                      validateField('firstName', text);
                    }
                  }}
                  placeholder="First name"
                />
                {isSubmitted && validationErrors.firstName && (
                  <Text style={styles.errorText}>{validationErrors.firstName}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last name</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isSubmitted && !validation.lastName && styles.inputError
                  ]}
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    if (isSubmitted) {
                      validateField('lastName', text);
                    }
                  }}
                  placeholder="Last name"
                />
                {isSubmitted && validationErrors.lastName && (
                  <Text style={styles.errorText}>{validationErrors.lastName}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Credit card number</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isSubmitted && !validation.cardNumber && styles.inputError
                  ]}
                  value={cardNumber}
                  onChangeText={formatCardNumber}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="number-pad"
                  maxLength={19}
                />
                {isSubmitted && validationErrors.cardNumber && (
                  <Text style={styles.errorText}>{validationErrors.cardNumber}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Security code</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isSubmitted && !validation.securityCode && styles.inputError
                  ]}
                  value={securityCode}
                  onChangeText={(text) => {
                    setSecurityCode(text);
                    if (isSubmitted) {
                      validateField('securityCode', text);
                    }
                  }}
                  placeholder="CVC"
                  keyboardType="number-pad"
                  maxLength={3}
                />
                {isSubmitted && validationErrors.securityCode && (
                  <Text style={styles.errorText}>{validationErrors.securityCode}</Text>
                )}
              </View>
              
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Card expiration date</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isSubmitted && !validation.expiryDate && styles.inputError
                  ]}
                  value={expiryDate}
                  onChangeText={formatExpiryDate}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  maxLength={5}
                />
                {isSubmitted && validationErrors.expiryDate && (
                  <Text style={styles.errorText}>{validationErrors.expiryDate}</Text>
                )}
              </View>
            </View>
            
            {/* Card Icons */}
            <View style={styles.cardIconsContainer}>
              <View style={styles.cardIconWrapper}>
                <FontAwesome name="cc-visa" size={28} color="#1A1F71" />
              </View>
              <View style={styles.cardIconWrapper}>
                <FontAwesome name="cc-mastercard" size={28} color="#EB001B" />
              </View>
            </View>
          </View>
        </View>
        
        {/* Pay Button */}
        <TouchableOpacity 
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay Now - 100 dh</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  selectedPaymentMethod: {
    backgroundColor: '#3498db',
  },
  paymentMethodText: {
    marginLeft: 6,
    color: '#333',
    fontSize: 12,
  },
  selectedPaymentMethodText: {
    color: '#fff',
  },
  formContainer: {
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.05)',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  cardIconsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cardIconWrapper: {
    padding: 8,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  payButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 30,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  paymentReference: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmationDetails: {
    width: '100%',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
});

export default PaymentScreen; 