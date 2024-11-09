import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Footer({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  return (
    <View style={styles.footerContainer}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => {
          setActiveTab('Home');
          navigation.navigate('HomeScreen');
        }}
      >
        <Icon
          name="home"
          size={24}
          color={activeTab === 'Home' ? '#00A8E8' : '#888'}
        />
        <Text style={[styles.footerLabel, activeTab === 'Home' && styles.activeLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Search Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => setActiveTab('Search')}
      >
        <Icon
          name="search"
          size={24}
          color={activeTab === 'Search' ? '#00A8E8' : '#888'}
        />
        <Text style={[styles.footerLabel, activeTab === 'Search' && styles.activeLabel]}>
          Search
        </Text>
      </TouchableOpacity>

      {/* Favorites Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => setActiveTab('Favorites')}
      >
        <Icon
          name="heart"
          size={24}
          color={activeTab === 'Favorites' ? '#00A8E8' : '#888'}
        />
        <Text style={[styles.footerLabel, activeTab === 'Favorites' && styles.activeLabel]}>
          Favorites
        </Text>
      </TouchableOpacity>

      {/* Inbox Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => setActiveTab('Inbox')}
      >
        <Icon
          name="envelope"
          size={24}
          color={activeTab === 'Inbox' ? '#00A8E8' : '#888'}
        />
        <Text style={[styles.footerLabel, activeTab === 'Inbox' && styles.activeLabel]}>
          Inbox
        </Text>
      </TouchableOpacity>

      {/* Account Tab */}
      <TouchableOpacity
        style={styles.footerItem}
        onPress={() => setActiveTab('Account')}
      >
        <Icon
          name="user"
          size={24}
          color={activeTab === 'Account' ? '#00A8E8' : '#888'}
        />
        <Text style={[styles.footerLabel, activeTab === 'Account' && styles.activeLabel]}>
          Account
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
    paddingVertical: 10,
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
