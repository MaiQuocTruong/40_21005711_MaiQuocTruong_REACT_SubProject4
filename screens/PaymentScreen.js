import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
    SafeAreaView,
    Modal,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPaymentModal from '../components/AddPaymentModal';

const PaymentScreen = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const total = route.params?.total;
  const [isAddPaymentModalVisible, setAddPaymentModalVisible] = useState(false);
  const [brandLogos, setBrandLogos] = useState([]);

  // Hàm thêm phương thức thanh toán mới
  const handleAddPayment = (newPaymentMethod) => {
    setPaymentMethods((prevMethods) => [...prevMethods, newPaymentMethod]);
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
        try {
            const accountID = await AsyncStorage.getItem('userID');
            const response = await axios.get('http://localhost:3000/api/ecommerce/paymentmethods', {
                params: { accountID: JSON.parse(accountID) },
            });
            setPaymentMethods(response.data);
            // Lấy danh sách thương hiệu thanh toán
            const brandResponse = await axios.get('http://localhost:3000/api/ecommerce/brandpayment');
            const brandData = brandResponse.data;
            setBrandLogos(brandData); // Lưu thông tin logo vào state

            const selected = response.data.find(method => method.selected);
            setSelectedMethod(selected?.id || null);
        } catch (error) {
            console.error('Lỗi khi tải phương thức thanh toán:', error);
        }
    };
    fetchPaymentMethods();
  }, []);

  const handleSelectMethod = (id) => {
    setSelectedMethod(id);
  };

  const handlePayNow = () => {
    if (!selectedMethod) {
      setAlertVisible(true);
    } else {
      setModalVisible(true);
    }
  };

  const confirmPayment = async () => {
    setModalVisible(false);
    setLoading(true);

    const accountID = await AsyncStorage.getItem('userID');
    const payload = {
        address: route.params.address,
        phone: route.params.phone,
        accountID: JSON.parse(accountID),
        paymentID: selectedMethod,
    };

    try {
        const response = await axios.post('http://localhost:3000/api/ecommerce/bill', payload);
        if (response.status === 200) {
            const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedMethod);
            const brandLogo = brandLogos.find(logo => logo.brand === selectedPaymentMethod.brand);
            navigation.navigate('PaymentSuccess', {
                selectedMethod: selectedPaymentMethod,
                brandLogo: brandLogo ? brandLogo.logo : null,
                total: route.params.total,
            });
        } else {
            alert('Error', response.data.message || 'Failed to process payment');
        }
    } catch (error) {
        console.error('Error saving bill:', error);
        alert('Error', 'An error occurred while processing your payment.');
    } finally {
        setLoading(false);
    }
  };

  const cancelPayment = () => {
    setModalVisible(false);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const renderPaymentMethod = ({ item }) => {
    const isSelected = selectedMethod === item.id;
    const brandLogo = brandLogos.find(logo => logo.brand === item.brand);

    return (
      <TouchableOpacity
        style={[styles.paymentMethod, isSelected && styles.selectedMethod]}
        onPress={() => handleSelectMethod(item.id)}
      >
        <Image
          style={styles.logo}
          source={brandLogo ? { uri: brandLogo.logo } : require('../assets/logo/agribank_logo.png')}
        />
        <Text style={styles.cardInfo}>
          {item.type === 'PayPal' ? item.email : `${item.number}`}
        </Text>
        <View style={styles.radioButtonContainer}>
          <View style={[styles.radioButton, isSelected ? styles.selectedRadioButton : styles.defaultRadioButton]}>
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bdd6" />
        <Text>Đang xử lý thanh toán...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#000"/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
        </View>
        <Text style={styles.totalText}>TOTAL</Text>
        <Text style={styles.amountText}>${total?.toFixed(2)}</Text>

        <View style={styles.paymentContainer}>
          <FlatList
            data={paymentMethods}
            renderItem={renderPaymentMethod}
            keyExtractor={item => item.id.toString()}
            style={styles.paymentList}
          />

          {/* Button Pay now */}
          <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
            <MaterialIcons name="payment" size={24} color="#fff" style={styles.icon}/>
            <Text style={styles.payButtonText}>Pay now</Text>
          </TouchableOpacity>

          {/* Button add payment method*/}
          <TouchableOpacity style={styles.addPayButton} onPress={() => setAddPaymentModalVisible(true)}>
            <MaterialCommunityIcons  name="credit-card-plus-outline" size={24} color="#00bdd6" style={styles.icon}/>
            <Text style={styles.addPayButtonText}>Add payment method</Text>
          </TouchableOpacity>
        </View>

        {/* Hiển thị modal */}
        <AddPaymentModal
          isVisible={isAddPaymentModalVisible}
          onClose={() => setAddPaymentModalVisible(false)}
          onSave={handleAddPayment}
        />;

        {/* Modal xác nhận thanh toán */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={cancelPayment}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác nhận thanh toán?</Text>
              <Text style={styles.modalMessage}>Bạn có muốn thanh toán với phương thức này không?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmPayment}>
                  <Text style={styles.modalButtonTextConfirm}>Có</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={cancelPayment}>
                  <Text style={styles.modalButtonTextCancel}>Không</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal thông báo chọn phương thức thanh toán */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={isAlertVisible}
          onRequestClose={closeAlert}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Thông báo</Text>
              <Text style={styles.modalMessage}>Vui lòng chọn 1 phương thức thanh toán.</Text>
              <TouchableOpacity style={styles.modalButtonConfirmOnePayment} onPress={closeAlert}>
                <Text style={styles.modalButtonTextConfirmOnePayment}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
    marginLeft: '-3%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
    marginLeft: 10,
  },
  totalText: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentList: {
    marginVertical: 20,
    width: '100%',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    width: '100%',
  },
  selectedMethod: {
    borderColor: '#00bdd6',
    borderWidth: 2,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    resizeMode: 'contain',
  },
  cardInfo: {
    fontSize: 18,
    flex: 1,
  },
  payButton: {
    backgroundColor: '#00bdd6',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  addPayButton: {
    borderWidth: 1,
    borderColor: '#00bdd6',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addPayButtonText: {
    color: '#00bdd6',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  radioButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderWidth: 2,
    borderColor: '#00bdd6',
  },
  defaultRadioButton: {
    borderWidth: 2,
    borderColor: '#ddd',
  },
  radioButtonInner: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#00bdd6',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: '#00bdd6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonConfirmOnePayment: {
    flex: 1,
    backgroundColor: '#00bdd6',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    width: '100%',
  },
  modalButtonTextConfirmOnePayment: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtonTextConfirm: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonTextCancel: {
    color: '#888',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentScreen;
