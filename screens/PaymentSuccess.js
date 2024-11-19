import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
    SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { CartContext } from '../contexts/CartContext';
import FeedbackModal from '../components/FeedbackModal'; 

const PaymentSuccess = () => {
    const route = useRoute();
    const selectedMethod = route.params?.selectedMethod || {};
    const total = route.params?.total || 0;
    const navigation = useNavigation();
    const { clearCart } = useContext(CartContext); // Sử dụng clearCart từ CartContext

    useEffect(() => {
        clearCart();
    }, []);

    const [rating, setRating] = useState(0); // State to manage selected star rating
    const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false); // State for modal visibility

    // Show feedback modal after 1 second
    useEffect(() => {
        const timer = setTimeout(() => {
            setFeedbackModalVisible(true);
        }, 1000);

        return () => clearTimeout(timer); // Clear the timeout when the component unmounts
    }, []);

    const handleStarPress = (index) => {
        setRating(index + 1); // Set the rating based on the star clicked
    };

    const renderPaymentMethod = () => {
        if (selectedMethod.type === 'PayPal') {
            return (
                <>
                    <Image source={require('../assets/Data/paypal.png')} style={styles.cardImage} />
                    <Text style={styles.cardText}>{selectedMethod.email}</Text>
                </>
            );
        } else if (selectedMethod.brand === 'momo') {
            return (
                <>
                    <Image source={require('../assets/Data/momo.png')} style={styles.cardImage} />
                    <Text style={styles.cardText}>****** {selectedMethod.number}</Text>
                </>
            );
        } else {
            const logo = selectedMethod.brand === 'visa' ? require('../assets/Data/visa.png') : require('../assets/Data/mastercard.png');
            return (
                <>
                    <Image source={logo} style={styles.cardImage} />
                    <Text style={styles.cardText}>****** {selectedMethod.number}</Text>
                </>
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
                {/* Success Icon */}
                <View style={styles.iconContainer}>
                    <Image source={require('../assets/Data/checksucces.png')} style={styles.logo} />
                </View>

                {/* Success Message */}
                <Text style={styles.successTextOrder}>Order placed successfully!</Text>
                <Text style={styles.descriptionText}>
                    Commodo eu ut sunt qui minim fugiat elit nisi enim
                </Text>

                {/* Order Summary */}
                <View style={styles.summaryContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Subtotal</Text>
                        <Text style={styles.value}>${total?.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tax (10%)</Text>
                        <Text style={styles.value}>${(total * 0.1).toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fees</Text>
                        <Text style={styles.value}>$0</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Card</Text>
                        <View style={styles.cardContainer}>
                            {renderPaymentMethod()}
                        </View>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.row}>
                        <Text style={styles.label}>Total</Text>
                        <View style={styles.totalContainer}>
                            <View style={styles.successBox}>
                                <Text style={styles.successText}>Success</Text>
                            </View>
                            <Text style={styles.total}>${(total * 1.1).toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Experience Rating */}
                <Text style={styles.ratingText}>How was your experience?</Text>
                <View style={styles.starContainer}>
                    {Array(5).fill(null).map((_, index) => (
                        <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                            <Icon
                                name="star"
                                size={26}
                                color={index < rating ? "#FFB400" : "#CCCCCC"} // Change color based on rating
                                style={styles.star}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Back to Home Button */}
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeScreen' }],
                    })}
                >
                    <Icon name="home" size={24} color="#fff" style={styles.icon} />
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>

                {/* Feedback Modal */}
                <FeedbackModal
                    isVisible={isFeedbackModalVisible}
                    onClose={() => setFeedbackModalVisible(false)}
                />

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
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    backButton: {
        padding: 10,
    },
    iconContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    successTextOrder: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00bdd6',
        marginBottom: 10,
        textAlign: 'center',
    },
    descriptionText: {
        width: 240,
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 30,
    },
    summaryContainer: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    label: {
        fontSize: 16,
        color: '#757575',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    successBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 10,
    },
    successText: {
        fontSize: 14,
        color: '#0e642a',
        fontWeight: '500',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        width: 34,
        height: 34,
        marginRight: 10,
        resizeMode: 'contain',
    },
    cardText: {
        fontSize: 14,
        fontWeight: '500',
    },
    total: {
        fontSize: 20,
        color: '#0e642a',
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
    },
    ratingText: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 10,
        textAlign: 'center',
    },
    starContainer: {
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'center',
    },
    star: {
        marginHorizontal: 5,
    },
    button: {
        width: '100%',
        backgroundColor: '#00bdd6',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 10,
    },
    icon: {
        marginRight: 2,
    },
});

export default PaymentSuccess;
