import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EditModal = ({ isVisible, onClose, member, onSave }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);  
      setPassword(member.password);  
    }
  }, [member]);

  const handleSave = () => {
    const updatedMember = { ...member, name, password }; 
    onSave(updatedMember);  
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-outline" size={24} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>Edit</Text>

          {/* Avatar Circle */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: `http://localhost:3000/uploads/${member.avatar}` }} style={styles.avatar} />
          </View>

          {/* Member Information Display */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.infoText}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Username:</Text>
            <Text style={styles.infoText}>{member.username}</Text>

            <Text style={styles.label}>Email:</Text>
            <Text style={styles.infoText}>{member.email}</Text>

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.infoText}
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Role:</Text>
            <Text style={styles.infoText}>{member.role}</Text>

            {/* <Text style={styles.label}>Date Added:</Text>
            <Text style={styles.infoText}>{member.dateAdded}</Text>

            <Text style={styles.label}>Last Active:</Text>
            <Text style={styles.infoText}>{member.lastActive}</Text> */}
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    width: '100%',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EditModal;
