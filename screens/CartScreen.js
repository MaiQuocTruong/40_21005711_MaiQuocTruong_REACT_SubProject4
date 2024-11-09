import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../contexts/CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [itemToRemove, setItemToRemove] = useState(null);
  const [emptyCartModalVisible, setEmptyCartModalVisible] = useState(false);
  const navigation = useNavigation();

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);

  const handleRemoveFromCart = (item) => {
    if (item.quantity === 1) {
      setItemToRemove(item);
      setModalVisible(true);
    } else {
      removeFromCart(item.id);
    }
  };

  const confirmRemove = () => {
    removeFromCart(itemToRemove.id);
    setModalVisible(false);
    setItemToRemove(null);
  };

  const cancelRemove = () => {
    setModalVisible(false);
    setItemToRemove(null);
  };

  const showErrorModal = (message) => {
    setErrorMessage(message);
    setModalVisible(true);
  };

  const handleNextPress = () => {
    if (cartItems.length === 0) {
      setEmptyCartModalVisible(true);
    } else {
      navigation.navigate('Payment', { total });
    }
  };

  const closeEmptyCartModal = () => {
    setEmptyCartModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View>
      <View style={styles.cartItem}>
        <Image source={{ uri: item.image }} style={styles.image}/>
        <View style={styles.details}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        <Text style={styles.quantity}>x{item.quantity}</Text>
        <TouchableOpacity onPress={() => handleRemoveFromCart(item)}>
          <MaterialIcons name="remove-circle" size={24} color="#FF0000"/>
        </TouchableOpacity>
      </View>
    </View>
  );  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={{ width: "100%", height: 500 }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#000"/>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart</Text>
          </View>

          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productList}
          />

          <View style={styles.voucherSection}>
            <TextInput style={styles.voucherInput} placeholder="Enter voucher code"/>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalText}>TOTAL</Text>
            <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNextPress}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>

        </ScrollView>

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={cancelRemove}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Bạn có muốn hủy sản phầm này không?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmRemove}>
                  <Text style={styles.buttonText}>Có</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelRemove}>
                  <Text style={styles.buttonText}>Không</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType="slide"
          visible={emptyCartModalVisible}
          onRequestClose={closeEmptyCartModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Giỏ hàng của bạn đang trống!</Text>
              <TouchableOpacity style={styles.confirmButton} onPress={closeEmptyCartModal}>
                <Text style={styles.buttonText}>OK</Text>
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
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#9c9c9c',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  }, 
  image: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#777',
    fontSize: 14,
  },
  price: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  voucherSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  voucherInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    width: '70%',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  applyButton: {
    backgroundColor: '#00A8E8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#00C2FF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    marginRight: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    marginLeft: 5,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CartScreen;
