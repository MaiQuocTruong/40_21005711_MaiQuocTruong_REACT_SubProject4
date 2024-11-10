import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import AntDesign from '@expo/vector-icons/AntDesign';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const ModalFilter = ({ visible, onClose, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([10, 1000]);
  const [averageReview, setAverageReview] = useState(4);
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [showAverageReview, setShowAverageReview] = useState(false);
  const [showOthers, setShowOthers] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); 
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
    onFilterChange(values);
  };

  const handleShippingOptionSelect = (option) => {
    setSelectedShippingOption(selectedShippingOption === option ? null : option);
  };
  
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Filter</Text>

          <ScrollView style={styles.scrollView}>
            {/* Shipping Options */}
            <Pressable onPress={() => setShowShippingOptions(!showShippingOptions)}>
              <View style={styles.btnShowCollapsible}>
                <Text style={styles.sectionTitle}>Shipping Options</Text>
                <AntDesign name={showShippingOptions ? "down" : "up"} size={20} color="black" />
              </View>
            </Pressable>
            <Collapsible collapsed={!showShippingOptions}>
              <View style={styles.option}>
                <Checkbox 
                  value={selectedShippingOption === 'instant'} 
                  onValueChange={() => handleShippingOptionSelect('instant')} 
                />
                <Text style={styles.optionText}>Instant (2 hours delivery)</Text>
              </View>
              <View style={styles.option}>
                <Checkbox 
                  value={selectedShippingOption === 'express'} 
                  onValueChange={() => handleShippingOptionSelect('express')} 
                />
                <Text style={styles.optionText}>Express (2 days delivery)</Text>
              </View>
              <View style={styles.option}>
                <Checkbox 
                  value={selectedShippingOption === 'standard'} 
                  onValueChange={() => handleShippingOptionSelect('standard')} 
                />
                <Text style={styles.optionText}>Standard (7-10 days delivery)</Text>
              </View>
            </Collapsible>

            {/* Price Range */}
            <Pressable onPress={() => setShowPriceRange(!showPriceRange)}>
              <View style={styles.btnShowCollapsible}>
                <Text style={styles.sectionTitle}>Price Range</Text>
                <AntDesign name={showPriceRange ? "down" : "up"} size={20} color="black" />
              </View>
            </Pressable>
            <Collapsible collapsed={!showPriceRange}>
              <View style={styles.priceRangeContainer}>
                <View style={styles.priceRange}>
                  <Text style={styles.priceText}>${priceRange[0]}</Text>
                  <Text style={styles.priceText}>${priceRange[1]}</Text>
                </View>
                <View style={styles.sliderContainer}>
                  <MultiSlider
                    values={priceRange}
                    sliderLength={280}
                    onValuesChange={handlePriceRangeChange}
                    min={10}
                    max={1000}
                    step={1}
                    selectedStyle={{ backgroundColor: '#00c2ff' }}
                    unselectedStyle={{ backgroundColor: '#ccc' }}
                    markerStyle={{ backgroundColor: '#00c2ff', height: 20, width: 20, borderRadius: 10 }}
                  />
                </View>
              </View>
            </Collapsible>


            {/* Average Review */}
            <Pressable onPress={() => setShowAverageReview(!showAverageReview)}>
              <View style={styles.btnShowCollapsible}>
                <Text style={styles.sectionTitle}>Average Review</Text>
                <AntDesign name={showAverageReview ? "down" : "up"} size={20} color="black" />
              </View>
            </Pressable>
            <Collapsible collapsed={!showAverageReview}>
              <View style={styles.ratingContainer}>
              <View style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < averageReview ? 'star' : 'star-outline'}
                    size={24}
                    color={i < averageReview ? '#ffd700' : '#ccc'}
                    onPress={() => setAverageReview(i + 1)}
                  />
                ))}
                <Text style={styles.ratingText}>& Up</Text>
              </View>
              </View>
            </Collapsible>

            {/* Others */}
            <Pressable onPress={() => setShowOthers(!showOthers)}>
              <View style={styles.btnShowCollapsible}>
                <Text style={styles.sectionTitle}>Others</Text>
                <AntDesign name={showOthers ? "down" : "up"} size={20} color="black" />
              </View>
            </Pressable>
            <Collapsible collapsed={!showOthers}>
              <View style={styles.otherOptions}>
                <TouchableOpacity  
                  style={[
                    styles.otherOption, 
                    { borderColor: selectedOption === 'return' ? '#00c2ff' : '#ccc' }
                  ]}
                  onPress={() => handleOptionSelect('return')}
                >
                  <Ionicons 
                    name="return-down-back-outline" 
                    size={20} 
                    color={selectedOption === 'return' ? '#00c2ff' : '#666'} 
                  />
                  <Text style={[styles.otherOptionText, { color: selectedOption === 'return' ? '#00c2ff' : '#666' }]}>30-day Free Return</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                  style={[
                    styles.otherOption, 
                    { borderColor: selectedOption === 'protection' ? '#00c2ff' : '#ccc' }
                  ]}
                  onPress={() => handleOptionSelect('protection')}
                >
                  <Ionicons 
                    name="shield-checkmark-outline" 
                    size={20} 
                    color={selectedOption === 'protection' ? '#00c2ff' : '#666'} 
                  />
                  <Text style={[styles.otherOptionText, { color: selectedOption === 'protection' ? '#00c2ff' : '#666' }]}>Buyer Protection</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                  style={[
                    styles.otherOption, 
                    { borderColor: selectedOption === 'deal' ? '#00c2ff' : '#ccc' }
                  ]}
                  onPress={() => handleOptionSelect('deal')}
                >
                  <Ionicons 
                    name="pricetag-outline" 
                    size={20} 
                    color={selectedOption === 'deal' ? '#00c2ff' : '#666'} 
                  />
                  <Text style={[styles.otherOptionText, { color: selectedOption === 'deal' ? '#00c2ff' : '#666' }]}>Best Deal</Text>
                </TouchableOpacity>
                <TouchableOpacity  
                  style={[
                    styles.otherOption, 
                    { borderColor: selectedOption === 'store' ? '#00c2ff' : '#ccc' }
                  ]}
                  onPress={() => handleOptionSelect('store')}
                >
                  <Ionicons 
                    name="location-outline" 
                    size={20} 
                    color={selectedOption === 'store' ? '#00c2ff' : '#666'} 
                  />
                  <Text style={[styles.otherOptionText, { color: selectedOption === 'store' ? '#00c2ff' : '#666' }]}>Ship to store</Text>
                </TouchableOpacity>
              </View>
            </Collapsible>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 0,
    marginRight: 10, 
  },
  btnShowCollapsible: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
  },
  priceRangeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  priceText: {
    fontSize: 14,
  },
  sliderContainer: {
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    alignItems: 'center',  
    justifyContent: 'center',
    marginBottom: 10,
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 14,
  },
  otherOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    marginVertical: 10,
  },
  otherOption: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '45%',
    height: 60,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otherOptionText: {
    marginLeft: 5,
    fontSize: 14,
  },
});

export default ModalFilter;
