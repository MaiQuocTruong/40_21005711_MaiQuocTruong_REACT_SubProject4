import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import axios from 'axios';
import Footer from '../components/Footer';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../contexts/CartContext';
import { AntDesign } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { getCartItemCount } = useContext(CartContext);
  const route = useRoute();
  const user = route.params?.user;
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const redBoxImages = [
    require('../assets/img/handbag_rec.jpg'),
    require('../assets/img/ipad1.jpg'),
  ];

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

  const fetchData = async () => {
    try {
      const categoriesResponse = await axios.get('http://localhost:3000/api/ecommerce/home');
      const dealsResponse = await axios.get('http://localhost:3000/api/ecommerce/deals');
      const recommendationsResponse = await axios.get('http://localhost:3000/api/ecommerce/recommendations');

      setCategories(categoriesResponse.data);
      setDeals(dealsResponse.data);
      setRecommendations(recommendationsResponse.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#000"/>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>All deals</Text>

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

          <View style={styles.searchContainer}>
            <View style={[styles.searchInputContainer, searchFocused && styles.inputContainerFocused]}>
              <MaterialIcons name="search" size={20} color="#aaa" style={styles.searchIcon}/>
              <TextInput 
                placeholder="Search" 
                style={styles.searchInput} 
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                value={searchText}
              />
            </View>
            <TouchableOpacity style={styles.sortButton}>
              <MaterialIcons name="sort" size={20} color="#000"/>
            </TouchableOpacity>
        </View>

        {/* Categories */}
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.categoryContainer} 
              onPress={() => { 
                if (item.name === 'Electronics') {
                  navigation.navigate('Electronics', { avatar: user?.avatar });
                } 
                else if (item.name === 'Fresh Fruits') {
                  navigation.navigate('Fresh', { avatar: user?.avatar });
                }
              }}
            >
              <View style={styles.circleContainer}>
                <Image source={{ uri: item.icon }} style={styles.categoryIcon} resizeMode="contain" />
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.categoryList}
        />

        {/* Featured Deals */}
        <View style={styles.dealsContainer}>
          {deals.map((deal) => (
            <View key={deal.id} style={styles.dealItem}>
              <View style={styles.dealCard}>
                <View style={styles.dealContent}>
                  <Text style={styles.dealTitle}>{deal.name}</Text>
                  <Text style={styles.dealDiscount}>{deal.discount} off</Text>
                  <TouchableOpacity style={styles.buyNowButton}>
                    <Text style={styles.buyNowText}>Buy now</Text>
                  </TouchableOpacity>
                </View>
                <Image source={{ uri: deal.image }} style={styles.dealImage} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.redContainer}>
          {redBoxImages.map((image, index) => (
            <View key={index} style={styles.redBox}>
              <Image source={image} style={styles.redBoxImage} />
            </View>
          ))}
        </View>

        {/* Recommended for You */}
        <View style={styles.recommendationsContainer}>
          <View style={styles.recommendationsHeader}>
            <Text style={styles.recommendationsTitle}>Recommended for you</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          <FlatList
            data={recommendations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.recommendationItem}>
                <Image source={{ uri: item.image }} style={styles.recommendationImage} />
                <Text style={styles.recommendationTitle}>{item.name}</Text>
                <View style={styles.priceRatingContainer}>
                  <Icon name="star" size={16} color="gold" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 0,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    flex: 1,
    padding: 10,
  },
  inputContainerFocused: {
    borderColor: '#1f1f1f',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    backgroundColor: 'transparent',
    outlineWidth: 0,
    flex: 1, 
  },
  sortButton: {
    width: 40,
    height: 40,
    padding: 10, 
    marginLeft: 12, 
    borderRadius: 10,
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryList: {
    marginHorizontal: 6,
  },
  categoryContainer: {
    alignItems: 'center',
    marginHorizontal: 10  ,
  },
  circleContainer: {
    width: 78,
    height: 78,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 5,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryText: {
    textAlign: 'center',
  },
  dealsContainer: {
    marginVertical: 10,
  },
  dealItem: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dealCard: {
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dealImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginLeft: 16,
  },
  dealContent: {
    flex: 1,
    paddingLeft: 16,
  },
  dealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
  },
  dealDiscount: {
    fontSize: 18,
    marginVertical: 4,
    color: '#555',
  },
  buyNowButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    width: 96,
    height: 36,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
  },
  redContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 0,
  },
  redBox: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redBoxImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  recommendationsContainer: {
    marginHorizontal: 22,
    marginVertical: 36,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: 'grey',
  },
  recommendationItem: {
    marginHorizontal: 10,
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recommendationTitle: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
    color: '#333'
  },
  priceRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,  // Adds some spacing between title and price/rating
  },
  ratingText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00bfff',
    marginLeft: 30,
  },
});