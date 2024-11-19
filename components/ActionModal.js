import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Import thư viện icon
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';  // Thêm Ionicons

const ActionModal = ({ visible, onClose, onEdit, onDelete, onView, position }) => {
  if (!visible) return null;

  // Extract position values for top and left
  const { top, left } = position || {};

  return (
    <Modal
      transparent={true}
      animationType="none"  // Tắt hiệu ứng
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { top: top, left: left }]}>

          {/* Edit Option */}
          <TouchableOpacity onPress={onEdit} style={styles.modalOption}>
            <Text style={styles.modalTextEdit}>Edit</Text>
            <FontAwesome name="edit" size={24} color="#16ba50" />
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Delete Option */}
          <TouchableOpacity onPress={onDelete} style={styles.modalOption}>
            <Text style={styles.modalTextDelete}>Delete</Text>
            <AntDesign name="delete" size={24} color="#bf3e37" />
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator} />

          {/* View Option with eye icon */}
          <TouchableOpacity onPress={onView} style={styles.modalOption}>
            <Text style={styles.modalTextView}>View</Text>
            <Ionicons name="eye-outline" size={24} color="grey" />  {/* Icon con mắt từ Ionicons */}
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 8,
    width: 167,  // Tăng kích thước modal để có đủ không gian cho các phần tử
    position: 'absolute',
    shadowColor: '#000',  // Màu của bóng
    shadowOffset: { width: 0, height: 2 },  // Vị trí của bóng
    shadowOpacity: 0.3,  // Độ mờ của bóng
    shadowRadius: 4,  // Độ lan tỏa của bóng
    elevation: 5,  // Độ cao của bóng, tăng để có bóng rõ hơn trên Android
  },
  modalOption: {
    flexDirection: 'row',  // Sắp xếp theo hàng ngang
    alignItems: 'center',  // Căn chỉnh icon và text theo chiều dọc
    justifyContent: 'center',
    paddingVertical: 10,  // Giảm padding cho các option
  },
  modalTextEdit: {
    fontSize: 16,  // Giảm kích thước font
    fontWeight: '500',
    paddingRight: 10,
    width: 90,
    color: '#16ba50',
  },
  modalTextDelete: {
    fontSize: 16,  // Giảm kích thước font
    fontWeight: '500',
    paddingRight: 10,
    width: 90,
    color: '#bf3e37',
  },
  modalTextView: {
    fontSize: 16,  // Giảm kích thước font
    fontWeight: '500',
    paddingRight: 10,
    width: 90,
    color: 'grey',
  },
  separator: {
    borderBottomWidth: 1,  // Độ dày của đường ngăn cách
    borderBottomColor: '#d3d3d3',  // Màu xám nhạt cho đường ngăn cách
    marginVertical: 10,  // Khoảng cách giữa các mục
  },
  closeButton: {
    position: 'absolute', 
    top: -10,
    right: -12,
    padding: 13,
    backgroundColor: 'transparent',
  },
});

export default ActionModal;
