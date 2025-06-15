
// CollectionScreen.js
// 獲得したカードの一覧画面

import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Modal, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameContext } from '../Game/Components/GameContext';

export default function CollectionScreen({ navigation }) {
    const { collectedCards, gachaAssetsLoaded, ALL_GACHA_CARDS } = useContext(GameContext);
  
     // ★モーダルの表示状態と選択されたカードの情報を管理するstate
     const [selectedCard, setSelectedCard] = useState(null);
     const [isModalVisible, setIsModalVisible] = useState(false);
 
     // IDを数値に変換するヘルパー関数 (App.jsのALL_GACHA_CARDSでIDが数値であることを前提)
     const getCardIdNumber = (card) => {
         // もしALL_GACHA_CARDSのidが文字列で、末尾の数字を使うなら、以下を使用
         // const match = card.id.match(/_(\d+)$/);
         // return match ? parseInt(match[1], 10) : 0;
         // idが数値であることを前提とする場合
         return card.id;
     };
 
 
     // 表示用のカードデータを準備
     const displayCards = ALL_GACHA_CARDS
         .sort((a, b) => getCardIdNumber(a) - getCardIdNumber(b)) // 数値IDでソート
         .map(card => {
             const collected = collectedCards.find(c => c.id === card.id);
             if (collected) {
                 return collected; // 獲得済みのカードデータを使用
             } else {
                 // 未入手の場合のダミーデータ
                 return {
                     id: card.id,
                     name: '???', // 不明
                     imageSource: require('../Game/Assets/Images/unknown.jpg'), // 未入手カード画像
                     author: '',
                     explanation: 'このカードはまだ入手していません。',
                     isUnknown: true,
                 };
             }
         });
 
     // ★カードタップ時の処理
     const handleCardPress = (card) => {
      setSelectedCard(card); // 未入手カードでも選択する
      setIsModalVisible(true); // モーダルを開く
  };
 
    // コレクションのカードをレンダリングする関数
    const renderCollectionCard = ({ item }) => (
      <TouchableOpacity
          style={[collectionStyles.cardContainer, item.isUnknown && collectionStyles.unknownCardContainer]}
          onPress={() => handleCardPress(item)}
          activeOpacity={0.7}
      >
          <Image
              source={item.imageSource}
              style={collectionStyles.cardImage}
          />
          <Text style={collectionStyles.cardName}>
              {getCardIdNumber(item)}. {item.name}
          </Text>
      </TouchableOpacity>
  );
 
     // ガチャ画像がまだロードされていない場合はローディング画面を表示
     if (!gachaAssetsLoaded) {
         return (
             <View style={collectionStyles.loadingContainer}>
                 <ActivityIndicator size="large" color="#6a0dad" />
                 <Text style={collectionStyles.loadingText}>ガチャ画像を読み込み中...</Text>
             </View>
         );
     }
 
     return (
         <View style={collectionStyles.container}>
             <StatusBar style="auto" />
             <Text style={collectionStyles.title}>カードコレクション</Text>
 
             {ALL_GACHA_CARDS.length === 0 ? (
                 <View style={collectionStyles.emptyCollection}>
                     <Text style={collectionStyles.emptyCollectionText}>
                         カードデータがまだ定義されていません。
                     </Text>
                 </View>
             ) : (
                 <FlatList
                     data={displayCards}
                     renderItem={renderCollectionCard}
                     keyExtractor={(item) => item.id.toString()}
                     numColumns={4} // ★4列に変更
                     contentContainerStyle={collectionStyles.cardGrid}
                 />
             )}
 
             <TouchableOpacity
                 style={collectionStyles.backButton}
                 onPress={() => navigation.goBack()}
             >
                 <Text style={collectionStyles.backButtonText}>ホームに戻る</Text>
             </TouchableOpacity>
 
             {/* ★カード詳細表示モーダル */}
             <Modal
                 animationType="fade" // モーダルの表示アニメーション
                 transparent={true} // 背景を透過させる
                 visible={isModalVisible} // モーダルの表示状態
                 onRequestClose={() => {
                     setIsModalVisible(!isModalVisible); // Androidのバックボタン対応
                 }}
             >
                 <View style={collectionStyles.centeredView}>
                     <View style={collectionStyles.modalView}>
                         {selectedCard && ( // selectedCardが存在する場合のみ表示
                             <ScrollView contentContainerStyle={collectionStyles.modalScrollViewContent}>
                                 <Image
                                     source={selectedCard.imageSource}
                                     style={collectionStyles.modalCardImage}
                                 />
                                 <Text style={collectionStyles.modalCardName}>
                                     {getCardIdNumber(selectedCard)}. {selectedCard.name}
                                 </Text>
                                 {selectedCard.author && (
                                     <Text style={collectionStyles.modalCardAuthor}>
                                         著者: {selectedCard.author}
                                     </Text>
                                 )}
                                 {selectedCard.explanation && (
                                     <Text style={collectionStyles.modalCardExplanation}>
                                         {selectedCard.explanation}
                                     </Text>
                                 )}
                             </ScrollView>
                         )}
                         <TouchableOpacity
                             style={collectionStyles.closeModalButton}
                             onPress={() => setIsModalVisible(false)}
                         >
                             <Text style={collectionStyles.closeModalButtonText}>閉じる</Text>
                         </TouchableOpacity>
                     </View>
                 </View>
             </Modal>
         </View>
     );
 }
 

// CollectionScreen 関数の外で画面幅を取得
const windowWidth = Dimensions.get('window').width;
const numColumns = 4;
const cardMargin = 4; // 各カードの左右・上下のマージン
const cardPadding = 5; // 各カードコンテナのパディング

// 1カードあたりの理論的な幅（マージンとパディングを含む）
const itemWidth = (windowWidth - (numColumns + 1) * cardMargin) / numColumns; // 左右の余白は列数+1個のマージンと考える



 const collectionStyles = StyleSheet.create({
     container: {
         flex: 1,
         backgroundColor: '#f0f0f0',
         alignItems: 'center',
         paddingTop: 50,
     },
     title: {
         fontSize: 30,
         fontWeight: 'bold',
         marginBottom: 20,
         color: '#333',
     },
     cardGrid: {
         padding: 5, // ★パディングを調整
         justifyContent: 'flex-start', // ★左上から詰めていく
         alignItems: 'flex-start', // ★左上から詰めていく
         width: '100%', // ★グリッドの幅を100%に
     },
     cardContainer: {
         backgroundColor: '#fff',
         borderRadius: 8, // ★少し小さく
         padding: 5, // ★パディングを調整
         margin: 4, // ★マージンを調整
         alignItems: 'center',
         justifyContent: 'flex-start',
         width: '23%', // ★4列表示のために幅を調整 (約100% / 4列 - 左右マージン分)
         aspectRatio: 0.7, // ★カードの縦横比を固定 (例: 1:0.7)
         elevation: 2, // 影を少し小さく
         shadowColor: '#000',
         shadowOffset: { width: 0, height: 1 },
         shadowOpacity: 0.15,
         shadowRadius: 2,
     },
     unknownCardContainer: {
         backgroundColor: '#ccc',
         opacity: 0.7,
     },
     cardImage: {
         width: '90%', // ★親コンテナに合わせて調整
         height: '70%', // ★名前表示スペースを考慮
         resizeMode: 'contain',
         marginBottom: 4, // マージン調整
     },
     cardName: {
         fontSize: 10, // ★フォントサイズを小さく
         fontWeight: 'bold',
         color: '#333',
         textAlign: 'center',
         // maxHeight: 30, // 名前が長すぎる場合のために高さを制限（任意）
     },
     // ★既存のcardAuthor, cardExplanationは一覧では使用しないが、スタイルは残しておくか削除
     // cardAuthor: { ... },
     // cardExplanation: { ... },
 
     emptyCollection: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         padding: 20,
     },
     emptyCollectionText: {
         fontSize: 18,
         color: '#777',
         textAlign: 'center',
         marginBottom: 20,
         lineHeight: 25,
     },
     goToShopButton: {
         backgroundColor: '#28a745',
         paddingVertical: 12,
         paddingHorizontal: 25,
         borderRadius: 25,
         elevation: 3,
     },
     goToShopButtonText: {
         color: '#fff',
         fontSize: 16,
         fontWeight: 'bold',
     },
     backButton: {
         backgroundColor: '#6c757d',
         paddingVertical: 10,
         paddingHorizontal: 20,
         borderRadius: 20,
         marginTop: 30,
         marginBottom: 20,
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
 
     // ★モーダル関連のスタイル
     centeredView: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: 'rgba(0,0,0,0.5)', // 半透明の背景
     },
     modalView: {
         margin: 20,
         backgroundColor: 'white',
         borderRadius: 20,
         padding: 25,
         alignItems: 'center',
         shadowColor: '#000',
         shadowOffset: {
             width: 0,
             height: 2,
         },
         shadowOpacity: 0.25,
         shadowRadius: 4,
         elevation: 5,
         width: '90%', // モーダルの幅
         maxHeight: '80%', // モーダルの最大高さ
     },
     modalScrollViewContent: {
         alignItems: 'center', // 中央寄せ
         paddingBottom: 20, // 閉じるボタンのための余白
     },
     modalCardImage: {
         width: 150, // モーダル内の画像サイズ
         height: 150,
         resizeMode: 'contain',
         marginBottom: 15,
     },
     modalCardName: {
         fontSize: 22,
         fontWeight: 'bold',
         marginBottom: 10,
         textAlign: 'center',
     },
     modalCardAuthor: {
         fontSize: 16,
         color: '#555',
         marginBottom: 8,
         textAlign: 'center',
     },
     modalCardExplanation: {
         fontSize: 14,
         color: '#333',
         lineHeight: 20,
         textAlign: 'left',
         marginTop: 10,
     },
     closeModalButton: {
         backgroundColor: '#6c757d',
         paddingVertical: 10,
         paddingHorizontal: 20,
         borderRadius: 20,
         marginTop: 20,
         elevation: 2,
     },
     closeModalButtonText: {
         color: 'white',
         fontWeight: 'bold',
         fontSize: 16,
     },
         cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: cardPadding, // 定数を使用
        margin: cardMargin, // 定数を使用
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: itemWidth - (cardPadding * 2), // ★計算した幅を適用し、パディングを差し引く
        aspectRatio: 0.7,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    cardImage: {
        // width: '90%', // これを一旦コメントアウトし、より具体的なサイズで試す
        // height: '70%', // 同上
        width: itemWidth * 0.6, // 例えば、カード全体の幅の60%
        height: itemWidth * 0.6 * 1.2, // 幅に対する比率で高さを決める (例: 1:1.2)
        resizeMode: 'contain',
        marginBottom: 4,
    },
    cardName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        flexShrink: 1, // ★テキストが長すぎても縮小されるように
    },
    cardContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: cardPadding, // 定数を使用
      margin: cardMargin, // 定数を使用
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: itemWidth - (cardPadding * 2), // ★計算した幅を適用し、パディングを差し引く
      aspectRatio: 0.7,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
  },
  cardImage: {
      // width: '90%', // これを一旦コメントアウトし、より具体的なサイズで試す
      // height: '70%', // 同上
      width: itemWidth * 0.6, // 例えば、カード全体の幅の60%
      height: itemWidth * 0.6 * 1.2, // 幅に対する比率で高さを決める (例: 1:1.2)
      resizeMode: 'contain',
      marginBottom: 4,
  },
  cardName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      flexShrink: 1, // ★テキストが長すぎても縮小されるように
  },
 });