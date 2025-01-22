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
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';

interface Article {
  image: string;
  title: string;
  description: string;
  link: string;
}

const { width, height } = Dimensions.get('window'); // Screen dimensions

const StoryScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://my-server-app.vercel.app/api/news');
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
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading articles...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled // Enables horizontal swipe with snapping
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.storyContainer}>
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.imageBackground}
              >
                <View style={styles.contentContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openURL(item.link);
                    }}
                  >
                    <Text style={styles.link}>Read More</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          )}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyContainer: {
    width: width,
    height: 700,
    padding: 20,
    borderRadius: 20
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    resizeMode: 'cover',
    borderRadius: 20
  },
  contentContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
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
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
  },
});

export default StoryScreen;
