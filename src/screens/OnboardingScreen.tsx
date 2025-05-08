import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

// Onboarding slides data
const SLIDES = [
  {
    id: '1',
    title: 'Bienvenue sur JobBridge',
    description: 'Votre passerelle vers l\'emploi dans le secteur public marocain',
    image: 'https://img.icons8.com/color/240/null/government-building.png',
  },
  {
    id: '2',
    title: 'Trouvez votre stage idéal',
    description: 'Parcourez des centaines d\'offres de stages et d\'alternances dans les institutions publiques',
    image: 'https://img.icons8.com/color/240/null/search-client.png',
  },
  {
    id: '3',
    title: 'Postulez facilement',
    description: 'Candidatez en quelques clics et suivez l\'avancement de vos candidatures',
    image: 'https://img.icons8.com/color/240/null/submit-resume.png',
  },
  {
    id: '4',
    title: 'Restez informé',
    description: 'Recevez des notifications et des mises à jour sur vos candidatures et nouvelles offres',
    image: 'https://img.icons8.com/color/240/null/notification-center.png',
  },
];

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };
  
  const handleSkip = () => {
    handleFinish();
  };
  
  const handleFinish = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  
  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });
    
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });
    
    return (
      <View style={styles.slide}>
        <Animated.View 
          style={[
            styles.imageContainer,
            { transform: [{ scale }], opacity }
          ]}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };
  
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, opacity },
                currentIndex === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipButtonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Ignorer</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />
      
      {renderDots()}
      
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButtonContainer: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    zIndex: 10,
  },
  skipButton: {
    padding: spacing.s,
  },
  skipButtonText: {
    color: colors.primary,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.medium,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
  },
  imageContainer: {
    width: width * 0.7,
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.xs / 2,
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  bottomContainer: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.l,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    ...shadows.medium,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
  },
});

export default OnboardingScreen; 