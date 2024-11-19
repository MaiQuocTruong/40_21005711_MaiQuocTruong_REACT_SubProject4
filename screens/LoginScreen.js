import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';  // Thêm import axios
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleRememberMe = () => {
    setIsRememberMe(!isRememberMe);
  };
  

  // Hàm xử lý khi nhấn nút Login
  const handleLogin = async () => {
    try {
        const response = await axios.post('http://localhost:3000/login', {
            username,
            password,
        });

        // Kiểm tra phản hồi
        if (response.status === 200) {
            const user = response.data.user;
            // Lưu avatar vào AsyncStorage
            await AsyncStorage.setItem('userAvatar', JSON.stringify(user.avatar));
            await AsyncStorage.setItem('userID', JSON.stringify(user.id));
            // Redirect based on user role
            if (user.role === 'Admin') {
                navigation.navigate("Management", { admin: user });  // Navigate to the Management screen for Admin
            } else {
                navigation.navigate("HomeScreen", { user: user });  // Navigate to HomeScreen for non-admin
            }
        } else {
            setModalMessage(response.data.message);
            setModalVisible(true);
        }
    } catch (error) {
        if (error.response) {
            setModalMessage(error.response.data.message);
            setModalVisible(true);
        } else {
            setModalVisible(true);
        }
    }
  };


  const handleSignUpNavigation = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <LinearGradient
      colors={["#9AB9F5", "#FFFFFF"]}
      locations={[0, 0.243]}
      start={{ x: 0, y: 0 }}
      end={{ x: -0.55, y: 1 }}
      style={styles.container}
    >
      <Image
        source={require('../assets/Data/24eveil_14.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Get Start Now</Text>
      <Text style={styles.subtitle}>Create an account or log in to explore about our app</Text>

      <TextInput
        style={[
          styles.input,
          { borderColor: isUsernameFocused ? "#007AFF" : "#E8E8E8" },
        ]}
        placeholder="Username"
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor="#A9A9A9"
        value={username}
        onChangeText={setUsername}
        onFocus={() => setIsUsernameFocused(true)}
        onBlur={() => setIsUsernameFocused(false)}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.inputPassword,
            { borderColor: isPasswordFocused ? "#007AFF" : "#E8E8E8" },
          ]}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor="#A9A9A9"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.showPasswordIcon}>
          <MaterialIcons
            name={isPasswordVisible ? "visibility-off" : "visibility"}
            size={24}
            color="#ACB5BB"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.rememberForgotContainer}>
        <TouchableOpacity
          onPress={toggleRememberMe}
          style={styles.checkboxContainer}
        >
          <View style={[styles.checkbox, isRememberMe && styles.checkboxChecked]}>
            {isRememberMe && (
              <MaterialIcons
                name="check"
                size={10}
                color="#FFFFFF"
                style={styles.checkIcon}
              />
            )}
          </View>
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate("ForgetPassScreen")}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Modal 
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <View style={styles.separatorContainer}>
        <View style={styles.separator} />
        <Text style={styles.separatorText}>Or</Text>
        <View style={styles.separator} />
      </View>

      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={{ uri: "https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1722952493",}}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={{
            uri: "https://companieslogo.com/img/orig/FB-2d2223ad.png?t=1720244491",
          }}
          style={styles.socialIcon}
        />
        <Text style={styles.socialText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={styles.footerTextNormal}>Don't have an account? </Text>
          <Text style={styles.footerTextLink} onPress={handleSignUpNavigation}>Sign Up</Text>
        </Text>
      </View>
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
  logo: {
    width: 350,
    height: 130,
    alignSelf: "center",
    resizeMode: 'contain',
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
    backgroundColor: '#FFFFFF',
  },
  showPasswordIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#B4B4B4',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#494948',
  },
  checkIcon: {
    marginTop: 2,
  },
  checkboxLabel: {
    fontSize: 12,
    color: '#333333',
  },
  forgotPassword: {
    alignItems: "flex-end",
  },
  loginButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
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
  modalMessage: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16, // Updated margin
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666666',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 16, // Updated margin
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: "500",
  },
  signupLink: {
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
  },
  footerText: {
    fontSize: 12,
  },
  footerTextNormal: {
    color: "#6C7278",
  },
  footerTextLink: {
    color: "#007AFF",
  },
});