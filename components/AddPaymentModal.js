import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList,
    Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPaymentModal = ({ isVisible, onClose, onSave }) => {
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [cardNumber, setCardNumber] = useState('');
    const [paypalEmail, setPaypalEmail] = useState('');
    const [userID, setUserID] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/ecommerce/brandpayment');
                setBrands(response.data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách brandpayment:', error);
            }
        };
        fetchBrands();

        const getUserID = async () => {
            const id = await AsyncStorage.getItem('userID');
            setUserID(JSON.parse(id));
        };
        getUserID();
    }, []);

    const handleSave = async () => {
        if (!selectedBrand) {
            setErrorMessage('Vui lòng chọn loại thanh toán.');
            setIsErrorModalVisible(true);
            return;
        }

        if (selectedBrand.brand !== 'PayPal' && !cardNumber.trim()) {
            setErrorMessage('Vui lòng nhập số thẻ.');
            setIsErrorModalVisible(true);
            return;
        }

        if (selectedBrand.brand === 'PayPal' && !paypalEmail.trim()) {
            setErrorMessage('Vui lòng nhập email PayPal.');
            setIsErrorModalVisible(true);
            return;
        }

        const payload = {
            type: selectedBrand.brand,
            number: selectedBrand.brand === 'PayPal' ? null : cardNumber,
            email: selectedBrand.brand === 'PayPal' ? paypalEmail : null,
            brand: selectedBrand.brand,
            accountID: userID,
            brandID: selectedBrand.brandID,
        };

        try {
            const response = await axios.post('http://localhost:3000/api/ecommerce/add-paymentmethods', payload);
            if (response.status === 200) {
                onSave(response.data);
                onClose();
            } else {
                setErrorMessage('Đã xảy ra lỗi khi thêm phương thức thanh toán.');
                setIsErrorModalVisible(true);
            }
        } catch (error) {
            console.error('Lỗi khi thêm phương thức thanh toán:', error);
            setErrorMessage('Đã xảy ra lỗi máy chủ.');
            setIsErrorModalVisible(true);
        }
    };

    const renderBrandItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.brandItem,
                selectedBrand?.brandID === item.brandID && styles.selectedBrand,
            ]}
            onPress={() => setSelectedBrand(item)}
        >
            <Image source={{ uri: item.logo }} style={styles.brandLogo} />
            <Text style={styles.brandName}>{item.brand}</Text>
        </TouchableOpacity>
    );

    const ErrorModal = () => (
        <Modal
            visible={isErrorModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsErrorModalVisible(false)}
        >
            <View style={styles.errorModalContainer}>
                <View style={styles.errorModal}>
                    <Text style={styles.errorTitle}>Thông Báo Lỗi</Text>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                    <TouchableOpacity
                        style={styles.errorButton}
                        onPress={() => setIsErrorModalVisible(false)}
                    >
                        <Text style={styles.errorButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );    

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <Text style={styles.title}>Thêm Phương Thức Thanh Toán</Text>
                <FlatList
                    data={brands}
                    renderItem={renderBrandItem}
                    keyExtractor={(item) => item.brandID.toString()}
                />
                {selectedBrand?.brand !== 'PayPal' && (
                    <TextInput
                        style={styles.input}
                        placeholder="Số thẻ"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                    />
                )}
                {selectedBrand?.brand === 'PayPal' && (
                    <TextInput
                        style={styles.input}
                        placeholder="Email PayPal"
                        value={paypalEmail}
                        onChangeText={setPaypalEmail}
                    />
                )}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleSave} style={styles.button}>
                        <Text style={styles.buttonText}>Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>Hủy</Text>
                    </TouchableOpacity>
                </View>
                <ErrorModal />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    brandItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    brandLogo: {
        width: 80,
        height: 80,
        marginRight: 10,
        resizeMode: 'contain'
    },
    brandName: {
        fontSize: 16,
    },
    selectedBrand: {
        backgroundColor: '#e6f7ff',
    },
    errorModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    errorModal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        alignItems: 'center',
    },
    errorButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },    
});

export default AddPaymentModal;
