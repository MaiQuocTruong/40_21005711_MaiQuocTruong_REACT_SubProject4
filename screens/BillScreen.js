import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminFooter from '../components/AdminFooter';
import { AntDesign } from '@expo/vector-icons';

const BillScreen = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState({});
  const navigation = useNavigation();

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
    axios
      .get('http://localhost:3000/bills')
      .then(response => {
        setBills(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu hóa đơn:", error);
        setLoading(false);
      });
  }, []);

  const getTimeOfDayGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const renderInvoice = ({ item }) => (
    <View style={styles.billContainer}>
      <Text style={styles.billText}>Mã hóa đơn: {item.billID}</Text>
      <Text style={styles.billText}>Mã account: {item.id}</Text>
      <Text style={styles.billText}>Tên: {item.name}</Text>
      <Text style={styles.billText}>Địa chỉ: {item.address}</Text>
      <Text style={styles.billText}>Số điện thoại: {item.phone}</Text>
      <Text style={styles.billText}>Brand: {item.brand}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

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

      {/* Bill List */}
      <ScrollView style={{ width: '100%', height: 500 }}>
        <FlatList
          data={bills}
          renderItem={renderInvoice}
          keyExtractor={item => item.billID.toString()}
        />
      </ScrollView>
      <AdminFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
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
  textContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  avatarAdmin: {
    width: 70,
    height: 70,
    borderRadius: 36,
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
  billContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  billText: {
    fontSize: 16,
    marginBottom: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BillScreen;
