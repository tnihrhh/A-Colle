// GameHomeScreen.js
// ゲーム選択ホーム画面コンポーネント

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // useNavigationをインポート
import { Platform } from 'react-native'; // Platformをインポート
import Constants from 'expo-constants'; // Expo Constantsをインポート (もしExpoを使用しているなら)

// Game01Screenなどのゲーム画面コンポーネントの定義はApp.jsに移動し、
// ここではインポートも不要です。

/**
 * ゲーム選択ホーム画面コンポーネント
 */
export default function GameHomeScreen() {
    const navigation = useNavigation(); // navigationオブジェクトを取得

    // /**
    //  * ゲームが選択されたときに呼び出されるハンドラー
    //  * @param {string} gameName - 選択されたゲームのReact Navigationの画面名
    //  */
    const handleSelectGame = (gameName) => {
        navigation.navigate(gameName); // 指定されたゲーム画面に遷移
    };

    return (
        <View style={styles.homeScreenContainer}>
            <Text style={styles.homeScreenTitle}>ゲームを選んでください</Text>
            <View style={styles.gameButtonsGrid}>
                {/* 神経衰弱ボタン */}
                <TouchableOpacity
                    onPress={() => handleSelectGame('MemoryGame')} // App.jsで定義した画面名を使用
                    style={[styles.gameButton, styles.purpleGameButton]}
                >
                    <Text style={styles.gameButtonEmoji}>🧠</Text>
                    <Text style={styles.gameButtonText}>神経衰弱</Text>
                </TouchableOpacity>
                {/* パズルボタン */}
                <TouchableOpacity
                    onPress={() => handleSelectGame('PuzzleGame')} // App.jsで定義した画面名を使用
                    style={[styles.gameButton, styles.tealGameButton]}
                >
                    <Text style={styles.gameButtonEmoji}>🧩</Text>
                    <Text style={styles.gameButtonText}>パズル</Text>
                </TouchableOpacity>
                {/* クイズボタン */}
                <TouchableOpacity
                    onPress={() => handleSelectGame('QuizGame')} // App.jsで定義した画面名を使用
                    style={[styles.gameButton, styles.orangeGameButton]}
                >
                    <Text style={styles.gameButtonEmoji}>❓</Text>
                    <Text style={styles.gameButtonText}>クイズ</Text>
                </TouchableOpacity>
                {/* RPGボタン */}
                <TouchableOpacity
                    onPress={() => handleSelectGame('RPGGame')} // App.jsで定義した画面名を使用
                    style={[styles.gameButton, styles.redGameButton]}
                >
                    <Text style={styles.gameButtonEmoji}>⚔️</Text>
                    <Text style={styles.gameButtonText}>RPG</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// React NativeのStyleSheetでスタイルを定義 (GameHomeScreenに関連するスタイルのみ残す)
const styles = StyleSheet.create({
    homeScreenContainer: {
        flex: 1,
        // alignItems: 'center', // 削除または調整が必要になる可能性あり
        // justifyContent: 'center', // 削除または調整が必要になる可能性あり
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 24, // 左右のパディングは残す
        // paddingTop: 24, // 元のパディング
        paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight + 20 : 20, // OSによって調整 (AndroidはStatusBarの高さも考慮)
        paddingBottom: 24, // 下部のパディング
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        maxWidth: 700,
        width: '100%',
        justifyContent: 'center', // 垂直方向の中央寄せ
        alignItems: 'center',     // 水平方向の中央寄せ
        paddingTop: Platform.OS === 'android' ? Constants.statusBarHeight + 20 : 20, // 上部パディング
    },
    homeScreenTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 40,
        width: '100%', // タイトルが左右に伸びるように
    },
    gameButtonsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        //gap: 16,
        width: '100%',
        paddingHorizontal: 0, // 親のpaddingとの兼ね合いで調整
    },
    gameButton: {
        // flexBasis: '48%', // もしgapを使うなら、marginとの組み合わせに注意
        width: '48%', // widthで直接指定し、justifyContent: 'space-between'で調整
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: '4%', // ボタンの行間の下マージンを調整 (例として4%)
        margin: '1%', // gapを使うなら不要な場合あり
    },
    purpleGameButton: {
        backgroundColor: '#8B5CF6',
    },
    tealGameButton: {
        backgroundColor: '#14B8A6',
    },
    orangeGameButton: {
        backgroundColor: '#F97316',
    },
    redGameButton: {
        backgroundColor: '#EF4444',
    },
    gameButtonEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    gameButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    // GameScreenContainer, GameScreenTitle, GameScreenDescription, button, buttonText など、
    // 各ゲーム画面のスタイルは、それぞれの画面ファイル（例: Game01Screen.js）に移動してください。
});