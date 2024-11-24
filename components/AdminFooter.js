import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AdminFooter() {
  const navigation = useNavigation();
  const route = useRoute(); // Dùng để lấy route hiện tại
  const [activeTab, setActiveTab] = useState(route.name); // Gán giá trị mặc định là tên route hiện tại

  // Cập nhật activeTab khi route thay đổi
  useEffect(() => {
    setActiveTab(route.name);
  }, [route.name]);

  return (
    <View style={styles.footerContainer}>
      {/* Account Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => {
          navigation.navigate('Management');
        }}
      >
        <Icon
          name="user"
          size={24}
          color={activeTab === 'Management' ? '#00A8E8' : '#888'}
        />
        <Text
          style={[styles.footerLabel, activeTab === 'Management' && styles.activeLabel]}
        >
          Account
        </Text>
      </TouchableOpacity>

      {/* Bill Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => {
          navigation.navigate('BillScreen');
        }}
      >
        <Icon
          name="file-text"
          size={24}
          color={activeTab === 'BillScreen' ? '#00A8E8' : '#888'}
        />
        <Text
          style={[styles.footerLabel, activeTab === 'BillScreen' && styles.activeLabel]}
        >
          Bill
        </Text>
      </TouchableOpacity>

      {/* Product Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => {
          navigation.navigate('ProductScreen'); // Điều hướng đến ProductScreen
        }}
      >
        <Icon
          name="shopping-cart"
          size={24}
          color={activeTab === 'ProductScreen' ? '#00A8E8' : '#888'}
        />
        <Text
          style={[styles.footerLabel, activeTab === 'ProductScreen' && styles.activeLabel]}
        >
          Product
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    color: '#888',
  },
  activeLabel: {
    color: '#00A8E8',
  },
});
