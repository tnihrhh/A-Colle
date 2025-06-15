// ShopHomeScreen.js
// ショップ画面 (ガチャ機能)

import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameContext } from '../Game/Components/GameContext';


export default function ShopHomeScreen({ navigation }) {
    const { tickets, spendTicket, addCollectedCard, gachaAssetsLoaded, ALL_GACHA_CARDS, money } = useContext(GameContext);
    const [lastPulledCard, setLastPulledCard] = useState(null);
  
    const handleGachaPull = () => {
      if (tickets < 1) {
        Alert.alert('チケットが足りません！', '神経衰弱をクリアするか、チケットを購入しましょう。');
        return;
      }
  
      spendTicket(1);
  
      const randomIndex = Math.floor(Math.random() * ALL_GACHA_CARDS.length);
      const pulledCard = ALL_GACHA_CARDS[randomIndex];
  
      addCollectedCard(pulledCard);
      setLastPulledCard(pulledCard);
  
      Alert.alert('ガチャ成功！', `${pulledCard.name} を獲得しました！\nコレクションで確認できます。`);
    };
  
    if (!gachaAssetsLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6a0dad" />
          <Text style={styles.loadingText}>ガチャ画像を読み込み中...</Text>
        </View>
      );
    }
  
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}> {/* ScrollViewで囲む */}
        <StatusBar style="auto" />
        <Text style={styles.title}>ショップ</Text>
        <Text style={styles.moneyText}>所持金: {money}円</Text>
        <Text style={styles.ticketsText}>現在のチケット: {tickets} 枚</Text>
  
        <TouchableOpacity
          style={styles.gachaButton}
          onPress={handleGachaPull}
          disabled={tickets < 1}
        >
          <Text style={styles.gachaButtonText}>ガチャを引く (1枚消費)</Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          style={styles.buyTicketsButton}
          onPress={() => navigation.navigate('BuyTickets')}
        >
          <Text style={styles.buyTicketsButtonText}>チケットを購入</Text>
        </TouchableOpacity>
  
        {lastPulledCard && (
          <View style={styles.pulledCardContainer}>
            <Text style={styles.pulledCardLabel}>新しく獲得したカード:</Text>
            <Image
              source={lastPulledCard.imageSource}
              style={styles.pulledCardImage}
            />
            <Text style={styles.pulledCardName}>{lastPulledCard.name}</Text>
            {lastPulledCard.author && ( // 作者が存在する場合のみ表示
              <Text style={styles.pulledCardAuthor}>作者: {lastPulledCard.author}</Text>
            )}
            {lastPulledCard.explanation && ( // 説明文が存在する場合のみ表示
              <Text style={styles.pulledCardExplanation}>{lastPulledCard.explanation}</Text>
            )}
          </View>
        )}
  
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>ホームに戻る</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    scrollContainer: { // ScrollViewのcontentContainerStyle
      flexGrow: 1, // コンテンツが画面より小さくても中央寄せを保つ
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      paddingVertical: 50, // 上下のパディングを追加して見やすくする
    },
    container: { // このスタイルは実質使われなくなるが、念のため残しておく
      flex: 1,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    moneyText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#008000',
      marginBottom: 10,
    },
    ticketsText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#6a0dad',
      marginBottom: 30,
    },
    gachaButton: {
      backgroundColor: '#dc3545',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
      marginTop: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    gachaButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    buyTicketsButton: {
      backgroundColor: '#17a2b8',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
      marginTop: 15,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    buyTicketsButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    pulledCardContainer: {
      marginTop: 40,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 20,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      width: '90%', // 表示エリアの幅を調整
    },
    pulledCardLabel: {
      fontSize: 18,
      marginBottom: 10,
      color: '#555',
    },
    pulledCardImage: {
      width: 150, // 画像サイズを大きく
      height: 150, // 画像サイズを大きく
      resizeMode: 'contain',
      marginBottom: 15,
    },
    pulledCardName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
      textAlign: 'center', // 中央寄せ
    },
    pulledCardAuthor: { // 作者用のスタイル
      fontSize: 16,
      color: '#666',
      marginBottom: 10,
      textAlign: 'center',
    },
    pulledCardExplanation: { // 説明文用のスタイル
      fontSize: 14,
      color: '#444',
      textAlign: 'center',
      lineHeight: 20, // 行間
    },
    backButton: {
      backgroundColor: '#6c757d',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginTop: 40,
      elevation: 3,
    },
    backButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 18,
      color: '#555',
    },
  });
  
  