import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    Modal,
    StyleSheet,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const FeedbackModal = ({ isVisible, onClose }) => {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [selectedMood, setSelectedMood] = useState(null);
    const [imageUri, setImageUri] = useState(null); // State to store image URI
    const [imageFile, setImageFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [userID, setUserID] = useState(null);

    // Lấy userID từ AsyncStorage nếu không truyền từ HomeScreen
    useEffect(() => {
        const fetchUserID = async () => {
            try {
                const storedUserID = await AsyncStorage.getItem('userID');
                if (storedUserID) {
                    setUserID(JSON.parse(storedUserID)); // Lưu vào state
                }
            } catch (error) {
                console.error('Lỗi khi lấy userID từ AsyncStorage:', error);
            }
        };
        fetchUserID();
    }, []);

    const toggleOption = (option) => {
        setSelectedOptions(prevState => ({
            ...prevState,
            [option]: !prevState[option],
        }));
    };

    const handleStarPress = (index) => {
        setRating(index + 1);
    };

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
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

    const handleRemoveImage = () => {
        setImageUri(null); // Remove the selected image
    };

    const handleSubmit = async () => {
        if (!feedback || !imageUri) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        const formData = new FormData();
        formData.append('comment', feedback);
        formData.append('accountID', userID); // Sử dụng userID từ AsyncStorage
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await axios.post('http://localhost:3000/submit-feedback', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('Phản hồi đã được gửi thành công!');
                onClose();
            } else {
                alert('Gửi phản hồi thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi khi gửi phản hồi:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }
    };      

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Feedback</Text>

                    {/* Mood Selection Section */}
                    <View style={styles.moodContainer}>
                        <TouchableOpacity onPress={() => handleMoodSelect('sad')}>
                            <Icon
                                name="frown-o"
                                size={40}
                                color={selectedMood === 'sad' ? "#00bdd6" : "#CCCCCC"}
                                style={styles.moodIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleMoodSelect('neutral')}>
                            <Icon
                                name="meh-o"
                                size={40}
                                color={selectedMood === 'neutral' ? "#00bdd6" : "#CCCCCC"}
                                style={styles.moodIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleMoodSelect('happy')}>
                            <Icon
                                name="smile-o"
                                size={40}
                                color={selectedMood === 'happy' ? "#00bdd6" : "#CCCCCC"}
                                style={styles.moodIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Options Section */}
                    <View style={styles.optionsContainer}>
                        {['Service', 'Quantity', 'Payment', 'Delivery', 'Promotion', 'Gift'].map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.optionButton, selectedOptions[option] && styles.optionSelected]}
                                onPress={() => toggleOption(option)}
                            >
                                <Text style={[styles.optionText, selectedOptions[option] ? styles.optionTextSelected : null]}>{option}</Text>
                                <Icon
                                  name={selectedOptions[option] ? 'check' : 'plus'}
                                  size={18}
                                  color={selectedOptions[option] ? '#00bdd6' : '#333'}
                                  style={styles.optionIcon}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Feedback Text Area with Label */}
                    <View style={styles.feedbackContainer}>
                        <Text style={styles.feedbackLabel}>Care to share more?</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Type your feedbacks"
                            placeholderTextColor="#c0c0c0"
                            value={feedback}
                            onChangeText={setFeedback}
                        />
                    </View>

                    {/* Image Upload Section */}
                    <Text style={styles.uploadLabel}>Upload images</Text>
                    <View style={styles.imageUploadContainer}>
                        <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePicker}>
                            <Ionicons name="add-outline" size={30} color="#CCC" />
                        </TouchableOpacity>
                        {/* Display uploaded image */}
                        {imageUri && (
                            <View style={styles.uploadedImage}>
                                <Image source={{ uri: imageUri }} style={styles.image} />
                                <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                                    <Ionicons name="close-outline" size={16} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Rating Section */}
                    <Text style={styles.uploadLabel}>Rating</Text>
                    <View style={styles.ratingContainer}>
                        {Array(5).fill(null).map((_, index) => (
                            <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                                <Icon
                                    name="star"
                                    size={26}
                                    color={index < rating ? "#FFB400" : "#CCCCCC"}
                                    style={styles.star}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    moodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
        marginBottom: 20,
    },
    moodIcon: {
        marginHorizontal: 10,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        margin: 5,
        width: 120,
    },
    optionSelected: {
        backgroundColor: '#ebfdff',
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    optionTextSelected: {
        color: '#00bdd6',
    },
    optionIcon: {
        marginLeft: 8,
    },
    feedbackContainer: {
        width: '100%',
        marginBottom: 20,
    },
    feedbackLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '600',
    },
    textArea: {
        width: '100%',
        height: 60,
        backgroundColor: '#ebebeb',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: '#6c757d', 
        fontSize: 16,
    },
    uploadLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '600',
    },
    imageUploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'flex-start'
    },
    imageUploadButton: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    uploadedImage: {
        position: 'relative',
        width: 60,
        height: 60,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#f00',
        borderRadius: 10,
        padding: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    star: {
        marginHorizontal: 3,
    },
    submitButton: {
        backgroundColor: '#00bdd6',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
});

export default FeedbackModal;
