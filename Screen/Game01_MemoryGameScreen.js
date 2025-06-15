// Game01_MemoryGameScreen.js
// 神経衰弱ゲームのメインロジックとUI

import React, { useState, useEffect, useContext } from 'react'; // useContextをインポート
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Card from '../Game/Components/Card'; // 個々のカードコンポーネントをインポート
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import { GameContext } from '../Game/Components/GameContext';

// 難易度と対応する時間（秒）を定義
const DIFFICULTIES = {
  'easy': { label: '易しい', time: 300 }, // 5分
  'normal': { label: '普通', time: 120 },   // 2分
  'hard': { label: '難しい', time: 30 },   // 30秒
  'oni': { label: '鬼', time: 15 },       // 15秒
};

// カードに表示する画像のパスのリスト（10種類）
// 画像ファイルはプロジェクト内の assets/images/ ディレクトリに配置してください
const ICONS = [
    require('../Game/Assets/Images/S10001.jpg'),
    require('../Game/Assets/Images/S10002.jpg'),
    require('../Game/Assets/Images/S10003.jpg'),
    require('../Game/Assets/Images/S10004.jpg'),
    require('../Game/Assets/Images/S10005.jpg'),
    require('../Game/Assets/Images/S10006.jpg'),
    require('../Game/Assets/Images/S10007.jpg'),
    require('../Game/Assets/Images/S10008.jpg'),
    require('../Game/Assets/Images/S10009.jpg'),
    require('../Game/Assets/Images/S10010.jpg'),
  ];
  
  // ゲームの初期状態を生成する関数
  const initializeCards = () => {
    let id = 0;
    // 10種類の画像を2枚ずつ作成
    const cards = ICONS.flatMap(imageSource => {
      return [
        { id: id++, imageSource, isFlipped: false, isMatched: false },
        { id: id++, imageSource, isFlipped: false, isMatched: false }
      ];
    });
  
    // カードをシャッフルする
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]]; // 配列の要素を入れ替える
    }
    return cards;
  };
  
  // 時間を分:秒形式にフォーマットするヘルパー関数
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  export default function Game01Screen() {
    const { addTicket } = useContext(GameContext);
  
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCardsCount, setMatchedCardsCount] = useState(0);
    const [moves, setMoves] = useState(0);
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  
    // 難易度選択時にゲームを初期化し、アセットをプリロードするEffect
    useEffect(() => {
      if (selectedDifficulty) {
        const loadAssets = async () => {
          try {
            setAssetsLoaded(false); // アセット読み込み開始時にロード中状態に
            await Asset.loadAsync(ICONS); // すべての画像をプリロード
            setAssetsLoaded(true); // 読み込み完了
            setCards(initializeCards()); // カードの初期化
            setTimeRemaining(DIFFICULTIES[selectedDifficulty].time);
            setFlippedCards([]);
            setMatchedCardsCount(0);
            setMoves(0);
            setGameOver(false);
            setGameStarted(false); // 難易度選択時はゲーム未開始状態
          } catch (error) {
            console.warn('画像の読み込みエラー:', error);
            Alert.alert('エラー', '画像の読み込みに失敗しました。');
            setAssetsLoaded(true); // エラーでも表示を止めるわけにはいかないのでtrueにしておく
          }
        };
        loadAssets();
      }
    }, [selectedDifficulty]);
  
    // タイマーとゲーム終了/時間切れのロジックを管理するEffect
    useEffect(() => {
      let interval;
      // タイマーは、難易度が選択され、ゲームが開始され、時間が残っており、ゲームが終了しておらず、全てのカードがマッチしていない場合に動作
      if (selectedDifficulty && gameStarted && timeRemaining > 0 && !gameOver && matchedCardsCount < ICONS.length) {
        interval = setInterval(() => {
          setTimeRemaining(prevTime => prevTime - 1);
        }, 1000);
      } else if (timeRemaining === 0 && selectedDifficulty && gameStarted && !gameOver && matchedCardsCount < ICONS.length) {
        // 時間切れの場合
        setGameOver(true);
        Alert.alert('時間切れ！', `残念！時間内にクリアできませんでした。\n手数: ${moves}`, [
          { text: 'もう一度プレイ', onPress: resetGame }
        ]);
      } else if (matchedCardsCount === ICONS.length && selectedDifficulty && gameStarted && !gameOver) {
        // ゲームをクリアした場合
        setGameOver(true); // ゲーム終了フラグを設定
        addTicket(); // ゲームクリア時にチケットを1枚追加
        Alert.alert('ゲームクリア！', `おめでとうございます！\n手数: ${moves}\n残り時間: ${formatTime(timeRemaining)}\nチケットを1枚獲得しました！`, [
            { text: 'もう一度プレイ', onPress: resetGame }
        ]);
      }
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [timeRemaining, selectedDifficulty, gameOver, moves, matchedCardsCount, gameStarted, addTicket]);
  
    // カードがタップされた時の処理
    const handleCardPress = (cardUniqueId) => {
      // ゲームが終了している場合、難易度が選択されていない場合、またはアセットがロードされていない場合は操作を無視
      if (gameOver || !selectedDifficulty || !assetsLoaded) {
        return;
      }
  
      // ゲームがまだ開始されていない場合、最初のカードタップでゲームを開始する
      if (!gameStarted) {
        setGameStarted(true);
      }
  
      // タップされたカードの一意なIDから、現在のcards配列内でのインデックスを見つける
      const currentCardIndex = cards.findIndex(card => card.id === cardUniqueId);
  
      // カードが見つからない、既にめくられている、既にマッチ済み、または既に2枚めくられている場合は操作を無視
      if (currentCardIndex === -1 || flippedCards.length === 2 || cards[currentCardIndex].isFlipped || cards[currentCardIndex].isMatched) {
        return;
      }
  
      // カードをめくる (イミュータブルな更新)
      const newCards = [...cards];
      newCards[currentCardIndex] = { ...newCards[currentCardIndex], isFlipped: true };
      setCards(newCards);
  
      // めくられたカードの *配列インデックス* をflippedCardsに追加
      const updatedFlippedCards = [...flippedCards, currentCardIndex];
      setFlippedCards(updatedFlippedCards);
  
      // 2枚目のカードがめくられた場合の処理
      if (updatedFlippedCards.length === 2) {
        setMoves(prevMoves => prevMoves + 1); // 手数を増やす
        const firstCardIndex = updatedFlippedCards[0]; // 1枚目のカードの配列インデックス
        const secondCardIndex = updatedFlippedCards[1]; // 2枚目のカードの配列インデックス
  
        // 2枚のカードが同じ画像かチェック
        if (newCards[firstCardIndex].imageSource === newCards[secondCardIndex].imageSource) {
          // マッチした場合 (イミュータブルな更新)
          newCards[firstCardIndex] = { ...newCards[firstCardIndex], isMatched: true };
          newCards[secondCardIndex] = { ...newCards[secondCardIndex], isMatched: true };
          setCards(newCards);
          setMatchedCardsCount(prevCount => prevCount + 1); // マッチしたペア数を増やす
          setFlippedCards([]); // めくられているカードをリセット
        } else {
          // マッチしなかった場合
          setTimeout(() => {
            // 0.8秒後にカードを裏に戻す (イミュータブルな更新)
            const resetCards = [...newCards];
            resetCards[firstCardIndex] = { ...resetCards[firstCardIndex], isFlipped: false };
            resetCards[secondCardIndex] = { ...resetCards[secondCardIndex], isFlipped: false };
            setCards(resetCards);
            setFlippedCards([]); // めくられているカードをリセット
          }, 800);
        }
      }
    };
  
    // ゲームをリセットする関数
    const resetGame = () => {
      setCards([]);
      setFlippedCards([]);
      setMatchedCardsCount(0);
      setMoves(0);
      setTimeRemaining(0);
      setGameOver(false);
      setSelectedDifficulty(null);
      setGameStarted(false);
      setAssetsLoaded(false);
    };
  
    // 難易度が選択されていない場合は、難易度選択画面をレンダリング
    if (!selectedDifficulty) {
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Text style={styles.title}>難易度選択</Text>
          {Object.entries(DIFFICULTIES).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.difficultyButton}
              onPress={() => setSelectedDifficulty(key)}
            >
              <Text style={styles.difficultyButtonText}>
                {value.label} (
                {value.time >= 60
                  ? `${value.time / 60}分`
                  : `${value.time}秒`}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  
    // 難易度が選択されているが、アセットがまだロードされていない場合はローディング画面を表示
    if (!assetsLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6a0dad" />
          <Text style={styles.loadingText}>画像を読み込み中...</Text>
        </View>
      );
    }
  
    // 難易度が選択され、アセットがロードされている場合は、ゲーム画面をレンダリング
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.title}>神経衰弱</Text>
        <Text style={styles.movesText}>手数: {moves}</Text>
        <Text style={styles.timerText}>残り時間: {formatTime(timeRemaining)}</Text>
        <FlatList
          data={cards}
          renderItem={({ item }) => (
            <Card
              key={item.id}
              imageSource={item.imageSource}
              isFlipped={item.isFlipped}
              isMatched={item.isMatched}
              onPress={() => handleCardPress(item.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
          numColumns={4}
          contentContainerStyle={styles.cardGrid}
        />
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>ゲームをリセット</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // スタイル定義
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 50,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    movesText: {
      fontSize: 18,
      marginBottom: 20,
      color: '#555',
    },
    timerText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#d9534f', // 赤色
    },
    cardGrid: {
      padding: 10,
    },
    resetButton: {
      backgroundColor: '#007bff',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginTop: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    resetButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    difficultyButton: {
      backgroundColor: '#6a0dad', // 紫色
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginVertical: 10,
      width: '70%',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    difficultyButtonText: {
      color: '#fff',
      fontSize: 20,
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
  