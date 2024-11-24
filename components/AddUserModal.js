import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';

export default function AddUserModal({ isVisible, onClose, onAddUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const validateSpecialChars = (text) => /^[a-zA-Z0-9_]+$/.test(text); // Chỉ cho phép chữ, số và _
    const validateEmailFormat = (text) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(text);
    const validateNameFormat = (text) => /^[a-zA-ZÀ-ỹ\s]+$/.test(text);

    const handleImagePicker = async () => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    setImageUri(URL.createObjectURL(file)); // Để hiển thị ảnh trên web
                    setImageFile(file); // Để upload lên server
                }
            };
            input.click();
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
  
            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
                setImageFile({
                    uri: result.assets[0].uri,
                    type: 'image/png', // type của ảnh
                    name: 'avatar.png', // tên file
                });
            }
        }
      };

    const handleAddUser = async () => {
        setErrorMessage('');

        if (!username || !password || !name || !email || !imageUri) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (!validateSpecialChars(username)) {
            setErrorMessage("Username không được chứa ký tự đặc biệt.");
            return;
        }

        if (!validateNameFormat(name)) {
            setErrorMessage("Name không được chứa ký tự đặc biệt.");
            return;
        }

        if (!validateEmailFormat(email)) {
            setErrorMessage("Email sai định dạng.");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("name", name);
        formData.append("email", email);
        if (Platform.OS === 'web') {
            formData.append('avatar', imageFile);
        } else {
            formData.append('avatar', imageFile);
        }

        //new code
        fetch('http://localhost:3000/register', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            if (data.user) {
              onAddUser(data.user);
            }
        })
        .catch(error => console.error('Error adding user:', error));

        // try {
        //     const response = await axios.post("http://localhost:3000/register", formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //         },
        //     });

        //     if (response.status === 201) {
        //         setErrorMessage("");
        //         onAddUser(); // Trigger callback to close modal and update state
        //     }
        // } catch (error) {
        //     setErrorMessage("Failed to add user.");
        // }
    };

    return (
        <Modal transparent={true} visible={isVisible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Close Button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close-outline" size={24} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Add User</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerButton}>
                        <Text style={{ color: 'white', fontWeight: "bold"}}>Upload Image</Text>
                    </TouchableOpacity>
                    {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    <TouchableOpacity onPress={handleAddUser} style={styles.addButton}>
                        <Text style={styles.buttonText}>Add User</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    imagePickerButton: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
    addButton: {
        backgroundColor: "#34d154",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
