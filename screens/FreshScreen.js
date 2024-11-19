import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import Footer from '../components/Footer';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Dots from 'react-native-dots-pagination'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import { CartContext } from '../contexts/CartContext';
import ModalFilter from '../components/ModalFilter';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FreshScreen() {
  const route = useRoute();
  // const { avatar } = route.params || {};
  const [avatar, setAvatar] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [activeDot, setActiveDot] = useState(0); 
  const navigation = useNavigation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [priceRange, setPriceRange] = useState([10, 1000]);
  const { addToCart, getCartItemCount } = useContext(CartContext);

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
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:3000/api/ecommerce/productsoffresh');
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterProductsByName = (text) => {
    setSearchText(text);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const filterByPriceRange = (range) => {
    const filtered = products.filter(product => {
      const price = parseFloat(product.price.replace('$', ''));
      return price >= range[0] && price <= range[1];
    });
    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
    filterByPriceRange(newPriceRange);
  };

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleProductPressDetail = (item) => {
    navigation.navigate('ProductDetail', {
      product: item,
    });
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

            <Text style={styles.headerTitle}>Fresh Fruits</Text>
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

            <Image source={userAvatar} style={styles.profileImage} />
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

          {/* Filter Modal for price range */}
          <ModalFilter visible={isModalVisible} onClose={toggleModal} onFilterChange={handleFilterChange}/>

          <View style={styles.staticImageContainer}>
            <Image source={require('../assets/img/banner1.jpg')} style={styles.staticImage} />
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

          {/* List of product numColumns 2 */}
          {filteredProducts.length === 0 ? (
            <Text style={styles.noProductsText}>No products found</Text>
          ) : (
            <FlatList
              data={showAllProducts ? filteredProducts : filteredProducts.slice(0, 4)} 
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productItem_1} onPress={() => handleProductPressDetail(item)}>
                  <Image source={{ uri: item.image }} style={styles.productImage_1} />
                  <View style={styles.productInfo_1}>
                    <Text style={styles.productName_1}>{item.name}</Text>
                    <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                      <MaterialIcons name="add" size={20} color="#fff"/>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.priceAndButton_1}>
                    <Image source={require('../assets/Data/Rating.png')} style={styles.ratingImage_1} />
                    <Text style={styles.productPrice_1}>{item.price}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.productList}
            />
          )}

          <TouchableOpacity style={styles.seeAllButton} onPress={toggleShowAllProducts}>
            <Text style={styles.seeAllButtonText}>{showAllProducts ? 'See less' : 'See all'}</Text>
          </TouchableOpacity>

          {/* Relevant products */}
          <View style={styles.categoriesHeader}>
            <Text style={styles.categoriesTitle}>Relevant products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* list of Relevant products */}
          {filteredProducts.length === 0 ? (
            <Text style={styles.noProductsText}>No products found</Text>
          ) : (
            <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <TouchableOpacity style={styles.productItem} onPress={() => handleProductPressDetail(item)}>
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
  productList: {
    paddingHorizontal: 16,
  },
  productItem_1: {
    width: '47%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  productImage_1: {
    width: 142,
    height: 142,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  productInfo_1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName_1: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingImage_1: {
    width: 60,
    height: 12,
    marginVertical: 5,
  },
  ratingImage: {
    width: 70,
    height: 14,
    marginTop: 14,
  },
  priceAndButton_1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  priceAndButton: {
    alignItems: 'center',
  },
  productPrice_1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: '#b8b8b8',
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
    color: 'grey',
    fontWeight: '600',
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginVertical: 20,
  },
  columnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
});
