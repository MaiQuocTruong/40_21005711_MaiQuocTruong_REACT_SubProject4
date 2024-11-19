import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Modal, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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

  const handleRegister = async () => {
        if (!username || !password || !name || !email || !imageUri) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
            setModalVisible(true);
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('email', email);
        if (Platform.OS === 'web') {
            formData.append('avatar', imageFile);
        } else {
            formData.append('avatar', imageFile);
        }

        try {
            const response = await axios.post('http://localhost:3000/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setErrorMessage(""); // Registration successful
                setModalVisible(true);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setErrorMessage('Username đã tồn tại');
                } else {
                    setErrorMessage(error.response.data.error || 'Registration failed');
                }
            } else {
                setErrorMessage('Network error');
            }
            setModalVisible(true);
        }
    };

    return (
        <LinearGradient
            colors={["#9AB9F5", "#FFFFFF"]}
            locations={[0, 0.243]}
            start={{ x: 0, y: 0 }}
            end={{ x: -0.55, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>Create an account to continue!</Text>

            <TextInput
                style={[styles.input, { borderColor: isUsernameFocused ? "#007AFF" : "#E8E8E8" }]}
                placeholder="Username"
                keyboardType="default"
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                value={username}
                onChangeText={setUsername}
            />

            {/* Name Input */}
            <TextInput
                style={[styles.input, { borderColor: isNameFocused ? "#007AFF" : "#E8E8E8" }]}
                placeholder="Name"
                keyboardType="default"
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                value={name}
                onChangeText={setName}
            />

            {/* Email Input */}
            <TextInput
                style={[styles.input, { borderColor: isEmailFocused ? "#007AFF" : "#E8E8E8" }]}
                placeholder="Email"
                keyboardType="default"
                autoCapitalize="none"
                placeholderTextColor="#A9A9A9"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                value={email}
                onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.inputPassword, { borderColor: isPasswordFocused ? "#007AFF" : "#E8E8E8" }]}
                    placeholder="Password"
                    secureTextEntry={!isPasswordVisible}
                    placeholderTextColor="#A9A9A9"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.showPasswordIcon}>
                    <MaterialIcons name={isPasswordVisible ? "visibility-off" : "visibility"} size={24} color="#ACB5BB" />
                </TouchableOpacity>
            </View>

            {/* Button to select an image */}
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
                <Text style={styles.imagePickerText}>Upload Image</Text>
            </TouchableOpacity>
            {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Text style={styles.footerTextLink} onPress={() => navigation.navigate("LoginScreen")}>Log in</Text>
                </Text>
            </View>

            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{errorMessage || "Đăng ký thành công"}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 34,
    color: "#333333",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputPassword: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  imagePickerButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
  },
  registerButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 12,
  },
  footerTextLink: {
    color: "#007AFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  }
});