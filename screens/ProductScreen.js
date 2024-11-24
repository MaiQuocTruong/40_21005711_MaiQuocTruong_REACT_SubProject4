import React, { useEffect, useState } from 'react'; 
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform, ScrollView, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminFooter from '../components/AdminFooter';
import * as ImagePicker from "expo-image-picker";
import AntDesign from '@expo/vector-icons/AntDesign';
import Collapsible from 'react-native-collapsible';

export default function ProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fresh");
  const [imageUri, setImageUri] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // State cho Electronics
  const [electronicsName, setElectronicsName] = useState("");
  const [electronicsPrice, setElectronicsPrice] = useState("");
  const [electronicsRating, setElectronicsRating] = useState("");
  const [electronicsDescription, setElectronicsDescription] = useState("");
  const [electronicsStatus, setElectronicsStatus] = useState("");
  const [categoryElectronics, setCategoryElectronics] = useState("Electronics");
  const [electronicsImageUri, setElectronicsImageUri] = useState(null);
  const [electronicsImageFile, setElectronicsImageFile] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [admin, setAdmin] = useState({});
  
  const [showForm, setShowForm] = useState(false); // State để điều khiển collapsible form
  const [showElectronicsForm, setShowElectronicsForm] = useState(false); // Collapsible form Electronics

  const navigation = useNavigation();
  const [products, setProducts] = useState([]); // State mới để lưu danh sách sản phẩm

  const fetchAdminData = async () => {
    try {
      const adminData = await AsyncStorage.getItem('user');
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin admin:", error);
    }
  };

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleElectronicsImagePicker = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setElectronicsImageUri(URL.createObjectURL(file));
          setElectronicsImageFile(file);
        }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setElectronicsImageUri(result.assets[0].uri);
        setElectronicsImageFile({
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "product-image.jpg",
        });
      }
    }
  };

  const getTimeOfDayGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleAddElectronics = async () => {
    if (!electronicsName || !electronicsPrice || !electronicsRating || !electronicsImageFile || !category) {
      setModalMessage("Vui lòng nhập đầy đủ thông tin.");
      setModalVisible(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", electronicsName);
    formData.append("price", `$${electronicsPrice}`);
    formData.append("rating", electronicsRating);
    formData.append("description", electronicsDescription);
    formData.append("status", electronicsStatus);
    formData.append("category", categoryElectronics);
    formData.append("image", electronicsImageFile);

    try {
      const response = await axios.post("http://localhost:3000/api/add-productelectronics", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setModalMessage("Thêm sản phẩm thành công!");
        setModalVisible(true);

        // Lấy danh sách các sản phẩm hiện tại
        const productResponse = await axios.get("http://localhost:3000/api/ecommerce/productsofelectronics");
        setProducts(productResponse.data);

        // Reset form
        setElectronicsName("");
        setElectronicsPrice("");
        setElectronicsRating("");
        setElectronicsDescription("");
        setElectronicsStatus("");
        setCategoryElectronics("Electronics");
        setElectronicsImageUri(null);
        setElectronicsImageFile(null);
      }
    } catch (error) {
      setModalMessage("Lỗi khi thêm sản phẩm.");
      setModalVisible(true);
    }
  };
  
  const handleImagePicker = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImageUri(URL.createObjectURL(file));
          setImageFile(file);
        }
      };
      input.click();
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageFile({
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: "product-image.jpg",
        });
      }
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || !rating || !imageFile || !category) {
      setModalMessage("Vui lòng nhập đầy đủ thông tin.");
      setModalVisible(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", `$${price}`);
    formData.append("rating", rating);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", imageFile);

    try {
      const response = await axios.post("http://localhost:3000/api/add-productfresh", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setModalMessage("Thêm sản phẩm thành công!");
        setModalVisible(true);

        // Lấy danh sách các sản phẩm hiện tại
        const productResponse = await axios.get("http://localhost:3000/api/ecommerce/productsoffresh");
        setProducts(productResponse.data);

        // Reset form
        setName("");
        setPrice("");
        setRating("");
        setDescription("");
        setCategory("Fresh");
        setImageUri(null);
        setImageFile(null);
      }
    } catch (error) {
      setModalMessage("Lỗi khi thêm sản phẩm.");
      setModalVisible(true);
    }
  };

  // Hàm mở modal danh sách sản phẩm fresh
  const handleViewProductList = async () => {
    try {
      const productResponse = await axios.get("http://localhost:3000/api/ecommerce/productsoffresh");
      setProducts(productResponse.data);
      setModalVisible(true); // Hiển thị modal khi đã lấy được danh sách sản phẩm
    } catch (error) {
      setModalMessage("Lỗi khi tải danh sách sản phẩm.");
      setModalVisible(true);
    }
  };

  // Hàm mở modal danh sách sản phẩm electronics
  const handleViewProductListElectronics = async () => {
    try {
      const productResponse = await axios.get("http://localhost:3000/api/ecommerce/productsofelectronics");
      setProducts(productResponse.data);
      setModalVisible(true); // Hiển thị modal khi đã lấy được danh sách sản phẩm
    } catch (error) {
      setModalMessage("Lỗi khi tải danh sách sản phẩm.");
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: `http://localhost:3000/uploads/${admin.avatar}` }} 
            style={styles.avatarAdmin} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>{getTimeOfDayGreeting()}!</Text>
            <Text style={styles.adminName}>{admin.name}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.exitIcon}>
          <AntDesign name="logout" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ width: '100%', height: 500 }}>
      <Pressable onPress={() => setShowForm(!showForm)} style={styles.toggleForm}>
        <Text style={styles.toggleText}>Thêm Sản Phẩm Fresh Food</Text>
        <AntDesign name={showForm ? "up" : "down"} size={20} color="black" />
      </Pressable>
      {/* Collapsible Form */}
      <Collapsible collapsed={!showForm}>
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tên sản phẩm"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá (Chỉ nhập số)"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Đánh giá (1-5)"
              keyboardType="numeric"
              value={rating}
              onChangeText={setRating}
            />
            <TextInput
              style={styles.input}
              placeholder="Mô tả sản phẩm"
              value={description}
              onChangeText={setDescription}
            />
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Fresh" value="Fresh" />
              <Picker.Item label="Food" value="Food" />
            </Picker>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
              <Text style={styles.imagePickerText}>Tải Ảnh Lên</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
            <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
              <Text style={styles.buttonText}>Thêm Sản Phẩm</Text>
            </TouchableOpacity>

            {/* Button Xem Danh Sách */}
            <TouchableOpacity style={styles.viewButton} onPress={handleViewProductList}>
              <Text style={styles.buttonText}>Xem Danh Sách Sản Phẩm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Collapsible>

      <Pressable onPress={() => setShowElectronicsForm(!showElectronicsForm)} style={styles.toggleForm}>
        <Text style={styles.toggleText}>Thêm Sản Phẩm Electronics</Text>
        <AntDesign name={showElectronicsForm ? "up" : "down"} size={20} color="black" />
      </Pressable>
      {/* Collapsible Form Electronics */}
      <Collapsible collapsed={!showElectronicsForm}>
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Tên sản phẩm"
              value={electronicsName}
              onChangeText={setElectronicsName}
            />
            <TextInput
              style={styles.input}
              placeholder="Giá (Chỉ nhập số)"
              keyboardType="numeric"
              value={electronicsPrice}
              onChangeText={setElectronicsPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Đánh giá (1-5)"
              keyboardType="numeric"
              value={electronicsRating}
              onChangeText={setElectronicsRating}
            />
            <TextInput
              style={styles.input}
              placeholder="Mô tả sản phẩm"
              value={electronicsDescription}
              onChangeText={setElectronicsDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Trạng thái"
              value={electronicsStatus}
              onChangeText={setElectronicsStatus}
            />
            <Picker
              selectedValue={categoryElectronics}
              onValueChange={(itemValue) => setCategoryElectronics(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Electronics" value="Electronics" />
              <Picker.Item label="Tools" value="Tools" />
            </Picker>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleElectronicsImagePicker}>
              <Text style={styles.imagePickerText}>Tải Ảnh Lên</Text>
            </TouchableOpacity>
            {electronicsImageUri && <Image source={{ uri: electronicsImageUri }} style={styles.previewImage} />}
            <TouchableOpacity style={styles.addButton} onPress={handleAddElectronics}>
              <Text style={styles.buttonText}>Thêm Sản Phẩm</Text>
            </TouchableOpacity>

            {/* Button Xem Danh Sách */}
            <TouchableOpacity style={styles.viewButton} onPress={handleViewProductListElectronics}>
              <Text style={styles.buttonText}>Xem Danh Sách Sản Phẩm</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Collapsible>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AdminFooter />
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Text style={styles.modalText}>{modalMessage}</Text> */}

            {/* Hiển thị danh sách sản phẩm trong modal */}
            {products.length > 0 && (
              <ScrollView style={styles.productList}>
                {products.map((product) => (
                  <View key={product.id} style={styles.productItem}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{product.name}</Text>
                      <Text style={styles.productPrice}>{product.price}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.buttonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarAdmin: {
    width: 70,
    height: 70,
    borderRadius: 36,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  adminName: {
    fontWeight: '400',
    fontSize: 18,
    color: 'grey',
  },
  exitIcon: {
    paddingHorizontal: 10,
  },
  formContainer: {
    padding: 16
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  imagePickerButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  imagePickerText: {
    color: "#fff",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  viewButton: {
    backgroundColor: "#2e58a6",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: '90%',
    maxWidth: 800,
  },
  modalText: {
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 10,
  },
  toggleForm: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productList: {
    maxHeight: 300, 
    marginTop: 10,
    width: '100%',
  },
  productItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  productPrice: {
    fontSize: 16,
    color: '#28A745',
  },
});
