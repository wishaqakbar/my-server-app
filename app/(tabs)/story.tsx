import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

// Define the Article interface
interface Article {
  image: string;
  title: string;
  description: string;
  link: string;
}

const { width, height } = Dimensions.get('window'); // To get the screen size

const StoryScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/news');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading articles...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {articles.map((article, index) => (
          <View key={index} style={styles.articleCard}>
            <ImageBackground
              source={{ uri: article.image }}
              style={styles.imageBackground}
              imageStyle={styles.image}
            >
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{article.title}</Text>
                <TouchableOpacity
                  onPress={() => {
                    // Open the article link
                    Linking.openURL(article.link);
                  }}
                >
                  <Text style={styles.link}>Read More</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flex: 1,
  },
  articleCard: {
    width: width,
    height: height, // Full screen height
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // Position content at the bottom
    height: height,
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 8,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    color: '#00f',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoryScreen;
