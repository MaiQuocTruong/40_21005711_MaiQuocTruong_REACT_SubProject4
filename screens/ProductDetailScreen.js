import React, { useState, useContext} from 'react'; 
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartContext } from '../contexts/CartContext';

const ProductDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { addToCart } = useContext(CartContext);
    const { product, relatedProducts } = route.params;
    // const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedGrid, setSelectedGrid] = useState(null);

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);    
    };

    const decreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    const priceNumber = parseFloat(product.price.replace('$', '').replace(',', ''));
    const totalPrice = (priceNumber * quantity).toFixed(2);

    const handleAddToCart = () => {
        addToCart(product, quantity);  
        navigation.navigate('Cart'); 
    };

    return (
        <ScrollView style={{ width: "100%", height: 500 }}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#000"/>
                </TouchableOpacity>
            </View>
            <View style={styles.productContainer}>
                <View style={styles.gridContainer}>
                    <TouchableOpacity style={styles.gridItemLarge}>
                        <Image 
                            source={{ uri: selectedGrid ? relatedProducts.find(item => item.id === selectedGrid).image : product.image }} 
                            style={styles.gridItemImageLarge} 
                        />
                    </TouchableOpacity>

                    <View style={styles.smallGridContainer}>
                        {relatedProducts.map(item => (
                            <TouchableOpacity 
                                key={item.id} 
                                style={[styles.gridItem, selectedGrid === item.id && styles.selectedGridItem]}
                                onPress={() => setSelectedGrid(item.id)}>
                                <Image source={{ uri: item.image }} style={styles.gridItemImage} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>{product.price}</Text>
                    <Text style={styles.offerText}>Buy 1 get 1</Text>
                </View>

                <View style={styles.productDetailsContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.productTitle}>{product.name}</Text>
                        <Text style={styles.productSubtitle}>{product.description}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Image
                            source={require('../assets/Data/Rating3.png')}
                            style={styles.starIcon}
                        />
                        <Text style={styles.ratingText}>4</Text>
                    </View>
                </View>

                {/* <Text style={[styles.sectionTitle, { fontSize: 20 }]}>Size</Text>
                <View style={styles.sizeContainer}>
                    {['XS', 'S', 'M', 'L', 'XL'].map((size, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.sizeButton, 
                                size === 'XS' && styles.xsSizeButton,
                                size === 'XL' && styles.xlSizeButton,
                                selectedSize === size && styles.selectedSizeButton
                            ]}
                            onPress={() => setSelectedSize(size)}
                        >
                            <Text style={[styles.sizeButtonText, selectedSize === size && styles.selectedSizeButtonText]}>{size}</Text>
                        </TouchableOpacity>
                    ))}
                </View>  */}

                <Text style={[styles.sectionTitle, { fontSize: 20 }]}>Color</Text>
                <View style={styles.colorContainer}>
                    {['green', 'red', 'yellow'].map((color, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.colorButton, selectedColor === color && styles.selectedColorButton]}
                            onPress={() => setSelectedColor(color)}
                        >
                            <View style={[styles.colorCircle, { backgroundColor: color }, selectedColor === color && styles.selectedColorCircle]} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionTitle, { fontSize: 20 }]}>Quantity</Text>
                <View style={styles.quantityContainer}>
                    <View style={styles.quantityButtonContainer}>
                        <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                            <FontAwesome name="minus-square" size={30} color="#3aabd1" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                            <FontAwesome name="plus-circle" size={30} color="#ff6347" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalText}>Total: </Text>
                        <Text style={[styles.totalAmount, { fontSize: 22 }]}>${totalPrice}</Text>
                    </View>
                </View>

                <View style={styles.sizeguidecontainer}>
                    <TouchableOpacity style={styles.sizeguidelink}>
                        <Text style={[styles.sizeguideText, { fontSize: 20, fontWeight: 'bold' }]}>Size guide</Text>
                    </TouchableOpacity>
                    <FontAwesome name='chevron-right' size={16} color="#aaa" style={styles.arrowIconsizeguide} />
                </View>

                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.reviewsLink}>
                        <Text style={[styles.reviewsText, { fontSize: 20, fontWeight: 'bold' }]}>Reviews (99)</Text>
                    </TouchableOpacity>
                    <FontAwesome name='chevron-right' size={16} color="#aaa" style={styles.arrowIcon} />
                </View>

                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#bababa',
    },
    headerContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        width: '100%',
    },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 10,
    },
    reviewsLink:{
        padding: 10,
        flex: 1,
    },
    reviewsText:{
        fontSize: 16,
        color: '#5c5d5e',
        marginLeft: '-5%',
    },
    arrowIcon:{
        marginRight: 10,
    },
    sizeguidecontainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        width: '100%',
        overflow: 'hidden',
    },
    sizeguidelink:{
        padding: 10,
        flex: 1,
    },
    sizeguideText:{
        fontSize: 16,
        color: '#5c5d5e',
        marginLeft: '-5%',
    },
    arrowIconsizeguide:{
        marginRight: 10,
    },
    productContainer:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'flex-start',
        width: '100%',
    },
    productDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
    },
    productTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productSubtitle:{
        fontSize: 16,
        color: '#777',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 24,
        paddingRight: 10,
    },
    starIcon:{
        width: 20,
        height: 20,
        marginRight: 5,
    },
    ratingText:{
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    priceContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    priceText:{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#00bdd6',
        marginRight: 10,
    },
    offerText:{
        fontSize: 14,
        color: '#ff6347',
        fontWeight: 'bold',
    },
    colorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        width: '70%',
    },
    colorButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 45,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColorButton: {
        borderColor: '#00bfff',
    },
    selectedColorCircle: {
        borderColor: '#00bfff',
        borderWidth: 2,
    },
    sizeContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
        width: '70%',
    },
    sizeButton:{
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    xsSizeButton:{
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
    },
    xlSizeButton:{
        borderTopRightRadius: 6,
        borderBottomRightRadius: 6,
    },
    selectedSizeButton: {
        backgroundColor: '#00bfff', // Nền xanh khi chọn:
        borderColor: '#00bfff',
        borderWidth: 2,
    },
    sizeButtonText:{
        fontSize: 14,
        color: 'black', // Mặc định chữ đen
    },
    selectedSizeButtonText: {
        color: 'white', // Chữ trắng khi chọn
    },
    quantityContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        width: '100%',
    },
    quantityButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton:{
        padding: 10,
    },
    quantityText:{
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 20,
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // Căn phải
        flex: 1, // Cho phép chiếm không gian còn lại
    },
    totalText:{
        marginRight: 5,
        fontSize: 16,
        color: '#333',
    },
    totalAmount:{
        fontWeight: 'bold',
        color: '#333',
    },
    addToCartButton:{
        backgroundColor: '#00bdd6',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 6,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartButtonText:{
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    gridContainer:{
        width: '100%',
        marginTop: -19,
    },
    gridItemLarge:{
        display: 'flex',
        width: '100%',
        height: 180,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    gridItemImageLarge:{
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
        borderRadius: 10,
    },
    smallGridContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flexWrap: 'wrap',
    },
    gridItem:{
        width: '23%',
        height: 80,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedGridItem:{
        borderColor: '#00bfff',
        borderWidth: 2,
    },
    gridItemImage:{
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
});

export default ProductDetailScreen;
