// App.js
// アプリケーションのルートコンポーネント、ナビゲーション、そしてゲーム全体の状態管理

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // ★追加: Bottom Tab Navigator
import { Ionicons } from '@expo/vector-icons'; // ★追加: アイコン用
import HomeScreen from './Screen/HomeScreen'; // ホーム画面コンポーネントをインポート
import GameScreen from './Screen/GameScreen'; // ゲーム画面コンポーネントをインポート
import ShopHomeScreen from './Screen/ShopHomeScreen'; // ショップ画面をインポート
import CollectionScreen from './Screen/CollectionScreen'; // コレクション画面をインポート
import { Asset } from 'expo-asset'; // Assetをインポート
import ALL_GACHA_CARDS from './Game/Components/GachaCardData'; // ガチャカードデータをインポート
import BuyTicketsScreen from './Screen/BuyTicketsScreen'; // BuyTicketsScreenをインポート
import NewsScreen from './Screen/NewsScreen';
import MissionScreen from './Screen/MissionScreen';
import TodayScreen from './Screen/TodayScreen';
import SocialScreen from './Screen/SocialScreen';
import GalleryScreen from './Screen/GalleryScreen';
import { GameContext } from './Game/Components/GameContext';


// ★ unknown_card.png のパスを定数として定義
const UNKNOWN_CARD_IMAGE_SOURCE = require('./Game/Assets/Images/unknown.jpg');

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // ★タブナビゲーターを作成

// ★ボトムタブナビゲーターのコンポーネント
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CollectionTab') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'SocialTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'GalleryTab') {
            iconName = focused ? 'image' : 'image-outline';
          } else if (route.name === 'ShopTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6a0dad', // アクティブなタブの色
        tabBarInactiveTintColor: 'gray', // 非アクティブなタブの色
        tabBarStyle: { height: 60, paddingBottom: 5 }, // タブバーのスタイル
        headerShown: false, // 各タブ画面のヘッダーは非表示にする（HomeScreenでヘッダー表示）
      })}>
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'ホーム' }} />
      <Tab.Screen name="CollectionTab" component={CollectionScreen} options={{ title: 'コレクション' }} />
      <Tab.Screen name="SocialTab" component={SocialScreen} options={{ title: 'SNS' }} />
      <Tab.Screen name="GalleryTab" component={GalleryScreen} options={{ title: 'ギャラリー' }} />
      <Tab.Screen name="ShopTab" component={ShopHomeScreen} options={{ title: 'ショップ' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [tickets, setTickets] = useState(0);
  const [money, setMoney] = useState(20000);
  const [collectedCards, setCollectedCards] = useState([]);
  const [gachaAssetsLoaded, setGachaAssetsLoaded] = useState(false);

  useEffect(() => {
    const loadGachaAssets = async () => {
      try {
        const imageAssets = ALL_GACHA_CARDS.map(card => card.imageSource);
        imageAssets.push(UNKNOWN_CARD_IMAGE_SOURCE); // unknown_card.pngもプリロード
        await Asset.loadAsync(imageAssets);
        setGachaAssetsLoaded(true);
      } catch (error) {
        console.warn('画像読み込みエラー:', error);
        setGachaAssetsLoaded(true);
      }
    };
    loadGachaAssets();
  }, []);

  const addTicket = (amount = 1) => setTickets(prevTickets => prevTickets + amount);
  const spendTicket = (amount) => setTickets(prevTickets => Math.max(0, prevTickets - amount));
  const addMoney = (amount) => setMoney(prevMoney => prevMoney + amount);
  const spendMoney = (amount) => setMoney(prevMoney => Math.max(0, prevMoney - amount));
  const addCollectedCard = (card) => setCollectedCards(prevCards => [...prevCards, card]);

  return (
    <GameContext.Provider value={{
      tickets, setTickets, addTicket, spendTicket,
      money, setMoney, addMoney, spendMoney,
      collectedCards, setCollectedCards, addCollectedCard,
      gachaAssetsLoaded,
      ALL_GACHA_CARDS,
    }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainTabs">
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}// ★タブナビゲーターをルートとして設定
            options={{ headerShown: false }}// Tab Navigator自身のヘッダーは非表示
          />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={{
              title: 'プレイ！神経衰弱',
              headerStyle: { backgroundColor: '#6a0dad' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="BuyTickets"
            component={BuyTicketsScreen}
            options={{
              title: 'チケット購入',
              headerStyle: { backgroundColor: '#6a0dad' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="News"// NewsScreen自体はタブ内のボタンから遷移するので、ここではタブバーを隠す目的でStack.Screenに登録
            component={NewsScreen}
            options={{
              title: 'ニュース',
              headerStyle: { backgroundColor: '#6a0dad' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="Mission"
            component={MissionScreen}
            options={{
              title: 'ミッション',
              headerStyle: { backgroundColor: '#6a0dad' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="Today"
            component={TodayScreen}
            options={{
              title: '今日のコンテンツ',
              headerStyle: { backgroundColor: '#6a0dad' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GameContext.Provider>
  );
}