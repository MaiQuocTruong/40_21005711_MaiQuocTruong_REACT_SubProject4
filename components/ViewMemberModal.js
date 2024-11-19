import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ViewMemberModal = ({ isVisible, onClose, member }) => {
    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Close Button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close-outline" size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Member Details</Text>

                    {/* Avatar Circle */}
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: `http://localhost:3000/uploads/${member.avatar}` }} style={styles.avatar} />
                    </View>

                    {/* Member Information Display */}
                    <View style={styles.infoContainer}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.infoText}>{member.name}</Text>

                        <Text style={styles.label}>Username:</Text>
                        <Text style={styles.infoText}>{member.username}</Text>

                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.infoText}>{member.email}</Text>

                        <Text style={styles.label}>Password:</Text>
                        <Text style={styles.infoText}>{member.password}</Text>

                        <Text style={styles.label}>Role:</Text>
                        <Text style={styles.infoText}>{member.role}</Text>

                        <Text style={styles.label}>Date Added:</Text>
                        <Text style={styles.infoText}>{member.dateAdded}</Text>

                        <Text style={styles.label}>Last Active:</Text>
                        <Text style={styles.infoText}>{member.lastActive}</Text>
                    </View>

                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
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
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ViewMemberModal;
