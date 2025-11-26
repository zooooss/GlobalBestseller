import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BookmarkScreen from './Bookmark';
import SettingsPage from './SettingsPage';
import { useBookmark } from './BookmarkContext';

export default function MainScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const [activeCountryTab, setActiveCountryTab] = useState('KOR');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('original'); // 'korean' or 'original'
  const { isBookmarked, toggleBookmark } = useBookmark();

  // 📘 베스트셀러 데이터 가져오기 (Home 탭일 때만)
  useEffect(() => {
    if (activeTab !== 'home') return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = '';
        if (activeCountryTab === 'KOR') {
          url = 'http://10.0.2.2:4000/kr-books';
        } else if (activeCountryTab === 'JPN') {
          url = 'http://10.0.2.2:4000/jp-books';
        } else if (activeCountryTab === 'USA') {
          url = 'http://10.0.2.2:4000/us-books';
        } else if (activeCountryTab === 'TWN') {
          url = 'http://10.0.2.2:4000/tw-books';
        } else if (activeCountryTab === 'FRA') {
          url = 'http://10.0.2.2:4000/fr-books';
        } else if (activeCountryTab === 'UK') {
          url = 'http://10.0.2.2:4000/uk-books';
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setBooks(data.books || []);
        setLoading(false);
      } catch (err) {
        console.error('❌ Fetch Error:', err);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [activeTab, activeCountryTab]);

  // 📚 책 아이템 렌더링
  const renderBookItem = ({ item, index }) => {
    const getDetailScreen = () => {
      if (activeCountryTab === 'KOR') return 'KrDetail';
      if (activeCountryTab === 'JPN') return 'JpDetail';
      if (activeCountryTab === 'USA') return 'UsDetail';
      if (activeCountryTab === 'TWN') return 'TwDetail';
      if (activeCountryTab === 'FRA') return 'FrDetail';
      if (activeCountryTab === 'UK') return 'UkDetail';
      return 'UsDetail';
    };

    const getCountry = () => {
      if (activeCountryTab === 'KOR') return 'KR';
      if (activeCountryTab === 'JPN') return 'JP';
      if (activeCountryTab === 'USA') return 'US';
      if (activeCountryTab === 'TWN') return 'TW';
      if (activeCountryTab === 'FRA') return 'FR';
      if (activeCountryTab === 'UK') return 'UK';
      return 'US';
    };

    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => {
          navigation.navigate(getDetailScreen(), {
            book: {
              title: item.title,
              author: item.author,
              publisher: item.publisher,
              image: item.image,
              link: item.link,
              country: getCountry(),
              // 상세 정보 필드도 전달 (캐시에서 온 데이터)
              description: item.description,
              contents: item.contents,
              authorInfo: item.authorInfo,
              publisherReview: item.publisherReview,
              plot: item.plot,
            },
          });
        }}
      >
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{index + 1}</Text>
        </View>
        
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.bookImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.author || 'Unknown Author'}
          </Text>
          {item.publisher && (
            <Text style={styles.bookMeta} numberOfLines={1}>
              {item.publisher} {item.genre ? `• ${item.genre}` : ''}
            </Text>
          )}
          {item.description && (
            <Text style={styles.bookDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.bookmarkIcon}
          onPress={(e) => {
            e.stopPropagation();
            const bookData = {
              title: item.title,
              author: item.author,
              publisher: item.publisher,
              image: item.image,
              link: item.link,
              country: getCountry(),
              // 상세 정보 필드도 포함
              description: item.description,
              contents: item.contents,
              authorInfo: item.authorInfo,
              publisherReview: item.publisherReview,
              plot: item.plot,
            };
            toggleBookmark(bookData);
          }}
        >
          <Icon 
            name={isBookmarked(item.title) ? "star" : "star-outline"} 
            size={24} 
            color={isBookmarked(item.title) ? "#FFD700" : "#999"} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderHomeContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={{ color: '#666', marginTop: 10 }}>불러오는 중...</Text>
        </View>
      );
    }

    return (
      <View style={styles.homeContainer}>
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Best Sellers</Text>
          <View style={styles.languageToggle}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'korean' && styles.languageOptionActive
              ]}
              onPress={() => setLanguage('korean')}
            >
              <Text style={[
                styles.languageText,
                language === 'korean' && styles.languageTextActive
              ]}>
                한국어
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'original' && styles.languageOptionActive
              ]}
              onPress={() => setLanguage('original')}
            >
              <Text style={[
                styles.languageText,
                language === 'original' && styles.languageTextActive
              ]}>
                Original
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 국가 선택 탭 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.countryTab, activeCountryTab === 'KOR' && styles.activeCountryTab]}
            onPress={() => setActiveCountryTab('KOR')}
          >
            <Text style={[styles.countryTabText, activeCountryTab === 'KOR' && styles.activeCountryTabText]}>
              KOR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countryTab, activeCountryTab === 'JPN' && styles.activeCountryTab]}
            onPress={() => setActiveCountryTab('JPN')}
          >
            <Text style={[styles.countryTabText, activeCountryTab === 'JPN' && styles.activeCountryTabText]}>
              JPN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countryTab, activeCountryTab === 'USA' && styles.activeCountryTab]}
            onPress={() => setActiveCountryTab('USA')}
          >
            <Text style={[styles.countryTabText, activeCountryTab === 'USA' && styles.activeCountryTabText]}>
              USA
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countryTab, activeCountryTab === 'TWN' && styles.activeCountryTab]}
            onPress={() => setActiveCountryTab('TWN')}
          >
            <Text style={[styles.countryTabText, activeCountryTab === 'TWN' && styles.activeCountryTabText]}>
              TWN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countryTab, activeCountryTab === 'FRA' && styles.activeCountryTab]}
            onPress={() => setActiveCountryTab('FRA')}
          >
            <Text style={[styles.countryTabText, activeCountryTab === 'FRA' && styles.activeCountryTabText]}>
              FRA
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.countryTab, activeCountryTab === 'UK' && styles.activeCountryTab]}
            onPress={() => setActiveCountryTab('UK')}
          >
            <Text style={[styles.countryTabText, activeCountryTab === 'UK' && styles.activeCountryTabText]}>
              UK
            </Text>
          </TouchableOpacity>
        </View>

        {/* 책 목록 */}
        <FlatList
          data={books.slice(0, 20)}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => `${activeCountryTab}-${index}`}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'bookmark':
        return <BookmarkScreen navigation={navigation} />;
      case 'settings':
        return <SettingsPage navigation={navigation} />;
      default:
        return renderHomeContent();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      {/* 하단 네비게이션 */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('home')}
        >
          <Icon 
            name="home-outline" 
            size={24} 
            color={activeTab === 'home' ? '#4285F4' : '#666'} 
          />
          <Text style={[styles.navLabel, activeTab === 'home' && styles.activeNavLabel]}>
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('bookmark')}
        >
          <Icon 
            name="bookmark-outline" 
            size={24} 
            color={activeTab === 'bookmark' ? '#4285F4' : '#666'} 
          />
          <Text style={[styles.navLabel, activeTab === 'bookmark' && styles.activeNavLabel]}>
            Bookmarks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('settings')}
        >
          <Icon 
            name="cog-outline" 
            size={24} 
            color={activeTab === 'settings' ? '#4285F4' : '#666'} 
          />
          <Text style={[styles.navLabel, activeTab === 'settings' && styles.activeNavLabel]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 80, // 하단 네비게이션 공간 확보
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  languageToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  languageOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  languageOptionActive: {
    backgroundColor: '#4285F4',
  },
  languageText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  countryTab: {
    marginRight: 30,
    paddingBottom: 10,
  },
  activeCountryTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4285F4',
  },
  countryTabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeCountryTabText: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rankContainer: {
    width: 30,
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 15,
  },
  imagePlaceholder: {
    width: 80,
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  bookInfo: {
    flex: 1,
    paddingRight: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    lineHeight: 22,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookMeta: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  bookDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  bookmarkIcon: {
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingBottom: 25,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    zIndex: 1000,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#666',
  },
  activeNavLabel: {
    color: '#4285F4',
    fontWeight: 'bold',
  },
});
