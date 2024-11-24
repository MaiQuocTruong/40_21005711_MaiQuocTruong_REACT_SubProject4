import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Platform, SafeAreaView, ScrollView } from 'react-native';
import { AntDesign, FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import ActionModal from '../components/ActionModal';  
import ViewMemberModal from '../components/ViewMemberModal';
import AddUserModal from '../components/AddUserModal';
import EditModal from '../components/EditModal';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import AdminFooter from '../components/AdminFooter';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Management({ route }) {
  const navigation = useNavigation();
  const [admin, setAdmin] = useState({});
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [isAddUserModalVisible, setAddUserModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalPosition, setModalPosition] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  
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
  
  useEffect(() => {
    fetchAdminData();
    loadTeamMembersFromStorage();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
        fetchTeamMembers(); // Tải lại danh sách mỗi khi màn hình được hiển thị
    }, [])
  );

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:3000/accounts');
      const data = await response.json();
      setTeamMembers(data);
      await AsyncStorage.setItem('teamMembers', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const loadTeamMembersFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('teamMembers');
      if (storedData) {
        setTeamMembers(JSON.parse(storedData));  // Lấy dữ liệu từ AsyncStorage và hiển thị
      } else {
        fetchTeamMembers(); // Nếu không có dữ liệu trong AsyncStorage, tải lại từ API
      }
    } catch (error) {
      console.error('Error loading accounts from AsyncStorage:', error);
    }
  };
  
  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  const handleOpenActionModal = (item, event) => {
    setSelectedMember(item);

    const { pageX, pageY } = event.nativeEvent;
    let modalLeft = pageX;
    let modalTop = pageY;

    const offset = -30;
    modalTop += offset;

    if (modalLeft + 200 > screenWidth) {
      modalLeft = screenWidth - 200;
    }

    if (modalTop + 100 > screenHeight) {
      modalTop = screenHeight - 100;
    }

    if (modalTop < 0) {
      modalTop = 0;
    }

    setModalPosition({ top: modalTop, left: modalLeft });
    setActionModalVisible(true);
  };

  const handleCloseActionModal = () => setActionModalVisible(false);

  const handleEdit = () => {
    setEditModalVisible(true);
    handleCloseActionModal();
  };

  const handleCloseEditModal = () => setEditModalVisible(false); 

  const handleDelete = () => {
    fetch('http://localhost:3000/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: selectedMember.username }), // Gửi username để xóa
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting account');
        }
        console.log('Account deleted successfully');
        fetchTeamMembers(); // Cập nhật lại danh sách thành viên sau khi xóa
        setActionModalVisible(false); // Đóng modal hành động
      })
      .catch(error => console.error('Error deleting account:', error));
  };
  

  const handleView = () => {
    setViewModalVisible(true);
    handleCloseActionModal();
  };

  const handleCloseViewModal = () => setViewModalVisible(false);

  // const handleAddUser = () => {
  //   setAddUserModalVisible(false);
  // };

  const handleAddUser = (newUser) => {
    setAddUserModalVisible(false);
    setTeamMembers((prevMembers) => [...prevMembers, newUser]);
  };

  const handleSave = (updatedMember) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    setEditModalVisible(false);
  };  

  const getTimeOfDayGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const renderItem = ({ item }) => (
    <View style={styles.memberRow}>
      <View style={styles.memberInfo}>
        <Image 
          source={{ uri: `http://localhost:3000/uploads/${item.avatar}` }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
  
      <TouchableOpacity style={[styles.roleDropdown, item.role === 'Admin' ? styles.adminRole : styles.userRole]}>
        <Text style={[styles.roleText, item.role === 'Admin' ? styles.adminText : styles.userText]}>
          {item.role}
        </Text>
      </TouchableOpacity>
  
      <TouchableOpacity onPress={(event) => handleOpenActionModal(item, event)}>
        <Entypo name="dots-three-vertical" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );  

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
    <ScrollView style={{ width: "100%", height: 500 }}>
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

      {/* Upload Section */}
      <View style={styles.uploadSection}>
        <Text style={styles.uploadText}>Add user in application</Text>
        <Text style={styles.maxSizeText}>Create user here</Text>
        <TouchableOpacity onPress={() => setAddUserModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add user</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={teamMembers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* <AddUserModal
        isVisible={isAddUserModalVisible}
        onClose={() => setAddUserModalVisible(false)}
        onAddUser={handleAddUser}
      /> */}
      {isAddUserModalVisible && (
          <AddUserModal
            onClose={() => setAddUserModalVisible(false)}
            onAddUser={(newUser) => handleAddUser(newUser)}
          />
      )}

      {/* Action Modal */}
      <ActionModal
        visible={actionModalVisible}
        onClose={handleCloseActionModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        position={modalPosition}
      />

      {/* View Member Modal */}
      {selectedMember && (
        <ViewMemberModal
          isVisible={viewModalVisible}
          onClose={handleCloseViewModal}
          member={selectedMember}
        />
      )}

      {/* Edit Modal */}
      {selectedMember && (
        <EditModal
          isVisible={editModalVisible}
          onClose={handleCloseEditModal}
          member={selectedMember}  // Pass selectedMember to the modal
          onSave={handleSave}
        />
      )}
    </ScrollView>
    <AdminFooter />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // container: { flex: 1, padding: 20 },
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
  textContainer: {
    flexDirection: 'column',
    marginLeft: 10, 
  },
  avatarAdmin: { width: 70, height: 70, borderRadius: 36,},
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
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
  uploadSection: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: { fontSize: 16, fontWeight: 'bold' },
  maxSizeText: { color: 'gray', marginBottom: 10 },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  name: { fontWeight: 'bold' },
  email: { color: 'gray' },
  roleDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    width: 90,
  },
  roleText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  adminRole: {
    borderColor: '#16ba50',
  },
  userRole: {
    borderColor: 'gray',
  },
  adminText: {
    color: '#16ba50',
  },
  userText: {
    color: 'black',
  },
});
