
// Card.js
// 個々のカードを表すコンポーネント

import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native'; // Imageコンポーネントをインポート
// FontAwesomeのアイコンは使用しないので、importは不要になります
// import { FontAwesome } from '@expo/vector-icons';


// Cardコンポーネントの定義
const Card = ({ imageSource, isFlipped, isMatched, onPress }) => { // iconからimageSourceにプロパティ名を変更
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        isFlipped ? styles.cardFlipped : styles.cardCovered, // めくられているか裏向きか
        isMatched && styles.cardMatched, // マッチしているか
      ]}
      disabled={isMatched} // マッチしたカードはタップ不可
    >
      {isFlipped || isMatched ? (
        // カードがめくられている、またはマッチしている場合は画像を表示
        <Image source={imageSource} style={styles.cardImage} /> /* FontAwesomeからImageに変更 */
      ) : (
        // カードが裏向きの場合は裏面テキストを表示
        <Text style={styles.cardCoveredText}>⭐</Text>
        // 裏面画像を使う場合はこちらを有効にする
        // <Image source={require('./assets/images/card_back.png')} style={styles.cardImage} />
      )}
    </TouchableOpacity>
  );
};

// Cardコンポーネントのスタイル
const styles = StyleSheet.create({
  card: {
    width: 80, // カードの幅
    height: 100, // カードの高さ
    margin: 5, // カード間の余白
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 3, // Androidの影
    shadowColor: '#000', // iOSの影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: 'hidden', // 画像がはみ出さないように
  },
  cardCovered: {
    backgroundColor: '#6a0dad', // 裏向きのカードの色（紫）
  },
  cardCoveredText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardFlipped: {
    backgroundColor: '#fff', // めくられたカードの色（白）
  },
  cardMatched: {
    backgroundColor: '#d4edda', // マッチしたカードの色（薄緑）
    opacity: 0.6, // マッチしたカードは少し透明にする
    borderColor: '#28a745', // マッチしたカードのボーダー色
  },
  cardImage: { // 画像用の新しいスタイル
    width: '90%', // カードサイズに合わせて調整
    height: '90%', // カードサイズに合わせて調整
    resizeMode: 'contain', // 画像がカード内に収まるように
  },
});

export default Card;
