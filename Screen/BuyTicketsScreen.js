// BuyTicketsScreen.js (新規ファイル)
// チケット購入画面

import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameContext } from '../Game/Components/GameContext';

// チケットパックの定義
const TICKET_PACKS = [
  { id: 'pack1', tickets: 10, price: 1000, label: '10チケット / 1000円' },
  { id: 'pack2', tickets: 60, price: 5000, label: '60チケット / 5000円' },
  { id: 'pack3', tickets: 120, price: 10000, label: '120チケット / 10000円' },
];

export default function BuyTicketsScreen({ navigation }) {
  const { money, spendMoney, addTicket } = useContext(GameContext);

  // チケット購入処理
  const handlePurchase = (pack) => {
    if (money >= pack.price) {
      Alert.alert(
        '購入確認',
        `${pack.label} を購入しますか？`,
        [
          {
            text: 'キャンセル',
            style: 'cancel',
          },
          {
            text: '購入',
            onPress: () => {
              spendMoney(pack.price); // 所持金を消費
              addTicket(pack.tickets); // チケットを追加
              Alert.alert('購入完了！', `${pack.tickets}チケットを獲得しました！\n残り所持金: ${money - pack.price}円`);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert('所持金が足りません！', `このチケットパックを購入するには、あと ${pack.price - money}円必要です。`);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>チケット購入</Text>
      <Text style={styles.moneyText}>現在の所持金: {money}円</Text>

      <View style={styles.ticketPacksContainer}>
        {TICKET_PACKS.map((pack) => (
          <TouchableOpacity
            key={pack.id}
            style={styles.ticketPackButton}
            onPress={() => handlePurchase(pack)}
          >
            <Text style={styles.ticketPackLabel}>{pack.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>ショップに戻る</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  moneyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008000', // 緑色
    marginBottom: 40,
  },
  ticketPacksContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  ticketPackButton: {
    backgroundColor: '#6a0dad', // 紫色
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  ticketPackLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d', // 灰色
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    elevation: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
