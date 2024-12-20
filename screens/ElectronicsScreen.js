import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import Footer from '../components/Footer';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import Dots from 'react-native-dots-pagination'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { CartContext } from '../contexts/CartContext';
import ModalFilter from '../components/ModalFilter';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ElectronicsScreen() {
  const route = useRoute();
  // const { avatar } = route.params || {};
  const [avatar, setAvatar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeDot, setActiveDot] = useState(0); 
  const navigation = useNavigation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([10, 1000]);

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

  const filterByPriceRange = (products, range, status) => {
    return products.filter(product => {
      const price = parseFloat(product.price.replace('$', '')); // Remove the '$' symbol and convert to number
      return price >= range[0] && price <= range[1] && product.status === status;
    });
  };  
  
  const handleFilterChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
    const filtered = filterByPriceRange(products, newPriceRange, selectedTab);
    setFilteredProducts(filtered);
  };

  const { addToCart, getCartItemCount } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:3000/api/ecommerce/categoriesofelectronic');
        const productsResponse = await axios.get('http://localhost:3000/api/ecommerce/productsofelectronics');
        setCategories(categoriesResponse.data);
        const productsWithCategory = productsResponse.data.map(product => ({
          ...product,
          category: 'Electronics'
        }));
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterProducts = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    const filtered = products.filter(product => 
      product.name === categoryName && 
      product.status === selectedTab &&
      product.category === "Electronics"
    );
    setFilteredProducts(filtered);
  };  

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(cat => cat.id === selectedCategoryId);
      const filtered = products.filter(product => 
        product.name === category.name && 
        product.status === selectedTab &&
        product.category === "Electronics"
      );
      const priceFiltered = filterByPriceRange(filtered, priceRange, selectedTab);
      setFilteredProducts(priceFiltered);
    }
  }, [selectedTab, selectedCategoryId, products, priceRange]);  

  const filterProductsByName = (text) => {
    setSearchText(text);
    setSelectedTab('');
    setSelectedCategoryId(null);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(text.toLowerCase()) &&
      (selectedCategoryId ? product.categoryId === selectedCategoryId : true)
    );
    setFilteredProducts(filtered);
  };

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };  

  const handleProductPress = (item) => {
    // Lấy 4 sản phẩm đầu tiên cùng loại
    const relatedProducts = filteredProducts.filter(product => product.name === item.name).slice(0, 4);
    navigation.navigate('ProductDetailScreen', {
      product: item,
      relatedProducts: relatedProducts,
    });
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

          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#000"/>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Electronics</Text>
            <Image source={userAvatar} style={styles.profileImage} />
            <TouchableOpacity 
              style={styles.cartButton} 
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={30} color="#9095a0"/>
              {/* Display red circle with number of items in the cart */}
              {getCartItemCount() > 0 && (
                <View style={styles.cartItemCount}>
                  <Text style={styles.cartItemCountText}>{getCartItemCount()}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* <Image 
              source={avatar ? { uri: `http://localhost:3000/uploads/${avatar}` } : require('../assets/img/ava1.png')} 
              style={styles.profileImage} 
            /> */}
            
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
                onChangeText={filterProductsByName}
              />
            </View>
            <TouchableOpacity style={styles.sortButton} onPress={toggleModal}>
              <MaterialIcons name="sort" size={20} color="#000"/>
            </TouchableOpacity>
          </View>

          <ModalFilter visible={isModalVisible} onClose={toggleModal} onFilterChange={handleFilterChange}/>

          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => filterProducts(category.id, category.name)}
                style={[styles.categoryContainer,
                  category.id === 1 && { backgroundColor: '#D8BFD8' },
                  category.id === 2 && { backgroundColor: '#ADD8E6' },
                  category.id === 3 && { backgroundColor: '#FFE4B5' },
                  { borderColor: selectedCategoryId === category.id ? 
                    (category.id === 1 ? '#c478f0' : category.id === 2 ? '#81a7de' : '#fccd7c') : 'transparent' }
                ]}>
                <Image
                  source={{ uri: category.icon }}
                  style={styles.categoryIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabs}>
            {['Best Sales', 'Best Matched', 'Popular'].map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
                <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredProducts.length === 0 ? (
            <Text style={styles.noProductsText}>No products found</Text>
          ) : (
            <FlatList
            data={showAllProducts ? filteredProducts : filteredProducts.slice(0, 4)} 
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Image source={require('../assets/Data/Rating.png')} style={styles.ratingImage} />
              </View>
              <View style={styles.priceAndButton}>
                <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                  <MaterialIcons name="add" size={20} color="#fff"/>
                </TouchableOpacity>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
            )}
            contentContainerStyle={styles.productList}
            />
          )}

          <TouchableOpacity style={styles.seeAllButton} onPress={toggleShowAllProducts}>
            <Text style={styles.seeAllButtonText}>{showAllProducts ? 'See less' : 'See all'}</Text>
          </TouchableOpacity>

          <View style={styles.staticImageContainer}>
            <Image source={require('../assets/Data/banner.png')} style={styles.staticImage} />
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
        </ScrollView>

        <Footer navigation={navigation} />
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
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00A8E8',
    fontWeight: '600',
  },
  categoryList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryContainer: {
    alignItems: 'center',
    width: 105,
    height: 92,
    borderRadius: 10,
    justifyContent: 'center',
    borderWidth: 2,
  },
  categoryIcon: {
    width: 76,
    height: 68,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#aaa',
  },
  activeTabText: {
    color: '#00A8E8',
    fontWeight: 'bold',
  },
  productList: {
    paddingHorizontal: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingImage: {
    width: 70,
    height: 14,
    marginTop: 14,
  },
  priceAndButton: {
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  addToCartButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00A8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllButton: {
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#d9d8d7',
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 16,
  },
  seeAllButtonText: {
    fontSize: 16,
    color: '#565e6c',
    fontWeight: '500',
  },
  staticImageContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  staticImage: {
    width: 370,
    height: 128,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  paginationDots: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginVertical: 20,
  },
});