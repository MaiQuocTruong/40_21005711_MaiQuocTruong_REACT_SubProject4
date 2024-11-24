import React, { useState, useEffect, useContext } from 'react';
import {View,Text,Image,ScrollView,TextInput,FlatList, TouchableOpacity, StyleSheet, Platform,SafeAreaView, Switch} from 'react-native';
import axios from 'axios';
import ReviewsSummary from '../components/ReviewsSummary';
import Dots from 'react-native-dots-pagination';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartContext } from '../contexts/CartContext';
import { FontAwesome, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetail = () => {
  const route = useRoute();
  const [avatar, setAvatar] = useState(null);
  const navigation = useNavigation();
  const { product } = route.params;
  const [activeDot, setActiveDot] = useState(0); 
  const [isNotified, setIsNotified] = useState(false);
  const [relevantProducts, setRelevantProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false); // State quản lý hiển thị review
  const { addToCart, getCartItemCount } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(product);  
    navigation.navigate('Cart'); 
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('userAvatar');
        if (storedAvatar) {
          setAvatar(JSON.parse(storedAvatar));  // Lấy avatar từ AsyncStorage
        }
      } catch (error) {
        console.error('Lỗi khi lấy avatar từ AsyncStorage:', error);
      }
    };

    fetchAvatar();
  }, []);

  const userAvatar = avatar ? { uri: `http://localhost:3000/uploads/${avatar}` } : require('../assets/personicon.png');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/ecommerce/feedback');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/ecommerce/productsoffresh');
        setRelevantProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews); // Chuyển đổi trạng thái hiển thị
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userAvatar'); // Xóa avatar lưu trữ
      await AsyncStorage.removeItem('userToken'); // Nếu có lưu token, xóa luôn
      navigation.replace('LoginScreen'); // Quay về LoginScreen
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={{ width: "100%", height: 500 }}>
          {/* Product Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#000"/>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{product.name}</Text>
            <Image source={userAvatar} style={styles.profileImage} />
            <TouchableOpacity 
              style={styles.cartButton} 
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={30} color="#9095a0"/>

              {getCartItemCount() > 0 && (
                <View style={styles.cartItemCount}>
                  <Text style={styles.cartItemCountText}>{getCartItemCount()}</Text>
                </View>
              )}
            </TouchableOpacity>
            {/* Logout Icon */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <AntDesign name="logout" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Product Image */}
          <View style={styles.staticImageContainer}>
            <Image source={{ uri: product.image }} style={styles.staticImage} /> 
          </View>

          <View style={styles.paginationDots}>
            <Dots
              length={4} 
              active={activeDot} 
              activeColor="#00A8E8"
              passiveColor="#ccc"
              passiveDotWidth={8} 
              activeDotWidth={22} 
              passiveDotHeight={8} 
            />
          </View>
          
          {/* Product Price and Rating */}
          <View style={styles.priceRating}>
            <Text style={styles.price}>{product.price}</Text>
            <View style={styles.rating}>
              <FontAwesome name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.5 (99 reviews)</Text>
            </View>
          </View>
          
          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>Quis occaecat magna elit magna do nisi ipsum ametaa...</Text>
          </View>
          
          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialIcons name="local-shipping" size={20} color="#00A8E8" />
              <Text style={styles.featureText}>Express</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="return-up-back-outline" size={20} color="#00A8E8" />
              <Text style={styles.featureText}>30-day free return</Text>
            </View>
  
            <View style={styles.featureItem}>
              <FontAwesome name="star" size={20} color="#00A8E8" />
              <Text style={styles.featureText}>Good review</Text>
            </View>
  
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-done-circle-outline" size={20} color="#00A8E8" />
              <Text style={styles.featureText}>Authorized shop</Text>
            </View>
          </View>
          
          {/* Reviews Section */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            <TouchableOpacity onPress={toggleShowAllReviews}>
              <Text style={styles.seeAllText}>{showAllReviews ? 'Show less' : 'See all'}</Text>
            </TouchableOpacity>
          </View>
          <ReviewsSummary/>
          {/* danh sách những người reviews(feedback) */}
          <FlatList
            data={showAllReviews ? reviews : reviews.slice(0, 2)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.reviewItem}>
                    <Image 
                      source={{ uri: `http://localhost:3000/uploads/${item.avatar}` }} 
                      style={styles.reviewerAvatar} 
                    />
                    <View style={styles.reviewTextContainer}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewerName}>{item.name}</Text>
                            <Text style={styles.reviewDate}>{formatDate(item.days)}</Text>
                        </View>
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                        {item.image && (
                          <Image 
                            source={{ uri: `http://localhost:3000/uploads/${item.image}` }}
                            style={styles.reviewImage} 
                          />
                        )}
                    </View>
                </View>
            )}
          />
          
          {/* Relevant Products Section */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Relevant products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={relevantProducts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.relevantProductsList}
            renderItem={({ item }) => (
              <View style={styles.relevantContainer}>
                <View style={styles.relevantProduct}>
                    <Image source={item.image} style={styles.relevantProductImage} />
                    <Text style={styles.productName}>{item.name}</Text>
                    <View style={styles.ratingandprice}>
                        <Text style={styles.productRating}>⭐ {item.rating}</Text>
                        <Text style={styles.productPrice}>{item.price}</Text>
                    </View>
                </View>
              </View>
            )}
          />
          
          {/* Notification Toggle */}
          <View style={styles.notificationContainer}>
          <View style={styles.notification}>
            <FontAwesome name="bell" size={24} color="white" style={styles.bellIcon} />
            <Text style={styles.notifyText}>Notify me of promotions</Text>
            <Switch
            value={isNotified}
            onValueChange={(value) => setIsNotified(value)}
            trackColor={{ false: "#ccc", true: "#00A8E8" }}
            thumbColor={isNotified ? "#fff" : "#f4f3f4"}
            />
          </View>
          </View>

          
          {/* Buy Now Button */}
          <View style={styles.buyNowButtonContainer}>
          <TouchableOpacity onPress={handleAddToCart}>
          <Ionicons name="cart-outline" size={31} color="#00C4CC" style={styles.iconcart} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleAddToCart}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
  cartButton: {
    marginLeft: 10,
    padding: 10,
  },
  cartItemCount: {
    position: 'absolute',
    top: 6,
    right: 4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoutButton: {
    marginLeft: 10,
    padding: 10,
  },
  staticImageContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  staticImage: {
    width: 370,
    height: 128,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  paginationDots: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceRating: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  descriptionContainer: {  
    alignItems: 'left',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  price: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 4, color: '#777', fontSize: 16, },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginVertical: 8 
  },
  titleReviews:{
    fontSize: 18, 
    fontWeight: 'bold', 
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  description: { color: '#666', marginBottom: 16, fontSize: 16, },
  featuresContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-around', 
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  featureItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    width: '48%',
    marginBottom: 20,
  },
  featureText: { 
    marginLeft: 6, 
    color: '#333',
    fontSize: 16, 
    fontWeight: '400',
  },  
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    paddingBottom: 10,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: 'grey',
    fontWeight: '600',
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reviewerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 20,
    marginRight: 12,
    top: -25,
  },
  reviewTextContainer: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '620',
    color: '#333',
  },
  reviewDate: {
    fontSize: 14,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    color: '#555',
  },
  reviewImage: {
    width: 70,   
    height: 70,  
    borderRadius: 8, 
    marginRight: 10,
    resizeMode: 'contain'
  },
  relevantProductsList: {
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 10,
  },
  relevantContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },  
  relevantProduct: {
    width: 130,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  relevantProductImage: {
    width: 105,
    height: 105,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    marginLeft: 10,
  },
  ratingandprice:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  productRating: {
    marginLeft: 7,
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  notification: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'grey'
  },
  notifyText: {
    flex: 1,
    marginLeft: 8,
    color: 'black',
    fontSize: 16,
  },
  bellIcon: {
    backgroundColor: '#00C4CC',
    padding: 10,
    borderRadius: 6,
  },  
  buyNowButtonContainer:{
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buyNowButton: { 
    flex:1,
    backgroundColor: '#00C4CC', 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginVertical: 16 ,
    marginLeft: 10,
  },
  buyNowText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  iconcart: {
    borderWidth: 1,
    borderColor: '#00C4CC',
    padding: 10,
    borderRadius: 6,
    marginRight: 10,
  }, 
});

export default ProductDetail;
