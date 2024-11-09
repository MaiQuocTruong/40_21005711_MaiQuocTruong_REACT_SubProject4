import React from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ReviewsSummary = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
    <View style={styles.reviewsandbarcontainer}>
      <View style={styles.reviewsContainer}>
        <View style={styles.reviewAndCount}>
          <Text style={styles.overallRating}>4.5/5</Text>
          <Text style={styles.reviewCount}>(99 reviews)</Text>
          <View style={styles.starsContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star" size={16} color="#FFD700" />
            <FontAwesome name="star-half" size={16} color="#FFD700" />
          </View>
        </View>

        {/** Rating bars */}
        <View>
          {Array.from({ length: 5 }, (_, i) => {
            const starCount = 5 - i;
            const widthPercentage = [80, 60, 50, 20, 10][i];
            return (
              <View key={starCount} style={styles.ratingRow}>
                <View style={styles.barContainer}>
                  <View style={[styles.ratingBar, { width: `${widthPercentage}%` }]} />
                </View>
                <Text style={styles.starLabel}>{starCount}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#fff' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  reviewsandbarcontainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5'
  },
  reviewsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewAndCount:{
    marginBottom: 8,
    marginRight: 22,
  },
  overallRating: {
    fontSize: 24,
    fontWeight: '460',
    color: '#333',
  },
  reviewCount: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  starLabel: {
    width: 20,
    fontSize: 14,
    color: '#333',
    right: -3,
  },
  barContainer: {
    width: '790%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginLeft: 8,
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 5,
  },
});

export default ReviewsSummary;
