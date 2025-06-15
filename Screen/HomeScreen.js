// HomeScreen.js
// アプリケーションのホーム画面
// Screen/HomeScreen.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameContext } from '../Game/Components/GameContext';

// ★新規作成するコンポーネント (仮)
// これらは実際のプロジェクトで別途ファイルとして作成してください
const ArticleCarousel = ({ articles }) => {
    // 記事のカルセルを実装
    // ここではダミー表示
    const [currentIndex, setCurrentIndex] = React.useState(0);
    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
        }, 3000); // 3秒ごとに切り替え
        return () => clearInterval(interval);
    }, [articles]);

    return (
        <View style={homeStyles.carouselContainer}>
            <Text style={homeStyles.sectionTitle}>注目記事</Text>
            <View style={homeStyles.carouselItem}>
                <Image source={{ uri: articles[currentIndex].imageUrl }} style={homeStyles.carouselImage} />
                <Text style={homeStyles.carouselText}>{articles[currentIndex].title}</Text>
            </View>
            <View style={homeStyles.carouselIndicators}>
                {articles.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            homeStyles.indicator,
                            index === currentIndex ? homeStyles.activeIndicator : homeStyles.inactiveIndicator,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const NavigationButtons = ({ navigation }) => {
    return (
        <View style={homeStyles.buttonGrid}>
            <Text style={homeStyles.sectionTitle}>コンテンツ</Text>
            <View style={homeStyles.buttonRow}>
                <TouchableOpacity
                    style={homeStyles.navButton}
                    onPress={() => navigation.navigate('News')} // ★App.jsのStack.Screen名
                >
                    <Text style={homeStyles.navButtonText}>ニュース</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={homeStyles.navButton}
                    onPress={() => navigation.navigate('Mission')} // ★App.jsのStack.Screen名
                >
                    <Text style={homeStyles.navButtonText}>ミッション</Text>
                </TouchableOpacity>
            </View>
            <View style={homeStyles.buttonRow}>
                <TouchableOpacity
                    style={homeStyles.navButton}
                    onPress={() => navigation.navigate('Game')} // ★App.jsのStack.Screen名
                >
                    <Text style={homeStyles.navButtonText}>神経衰弱</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={homeStyles.navButton}
                    onPress={() => navigation.navigate('Today')} // ★App.jsのStack.Screen名
                >
                    <Text style={homeStyles.navButtonText}>今日のコンテンツ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AdBanner = () => {
    return (
        <View style={homeStyles.adBannerContainer}>
            <Text style={homeStyles.adBannerText}>広告スペース</Text>
        </View>
    );
};

const RankingSection = () => {
    const [rankingTab, setRankingTab] = React.useState('daily'); // 'daily', 'weekly', 'monthly'

    // ダミーのランキングデータ
    const dummyRankings = {
        daily: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `デイリーユーザー${i + 1}`, score: 1000 - i * 10 })),
        weekly: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `週間ユーザー${i + 1}`, score: 5000 - i * 50 })),
        monthly: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `月間ユーザー${i + 1}`, score: 20000 - i * 200 })),
    };

    return (
        <View style={homeStyles.rankingSection}>
            <Text style={homeStyles.sectionTitle}>ランキング</Text>
            <View style={homeStyles.rankingTabs}>
                <TouchableOpacity
                    style={[homeStyles.rankingTabButton, rankingTab === 'daily' && homeStyles.activeRankingTab]}
                    onPress={() => setRankingTab('daily')}
                >
                    <Text style={homeStyles.rankingTabText}>本日</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[homeStyles.rankingTabButton, rankingTab === 'weekly' && homeStyles.activeRankingTab]}
                    onPress={() => setRankingTab('weekly')}
                >
                    <Text style={homeStyles.rankingTabText}>週間</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[homeStyles.rankingTabButton, rankingTab === 'monthly' && homeStyles.activeRankingTab]}
                    onPress={() => setRankingTab('monthly')}
                >
                    <Text style={homeStyles.rankingTabText}>月間</Text>
                </TouchableOpacity>
            </View>
            <View style={homeStyles.rankingList}>
                {dummyRankings[rankingTab].map((item) => (
                    <View key={item.id} style={homeStyles.rankingItem}>
                        <Text style={homeStyles.rankingItemRank}>{item.id}.</Text>
                        <Text style={homeStyles.rankingItemName}>{item.name}</Text>
                        <Text style={homeStyles.rankingItemScore}>{item.score}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};


export default function HomeScreen({ navigation }) {
    // ダミーの注目記事データ (実際はAPIから取得)
    const dummyArticles = [
        { id: '1', title: '最新イベント開催中！', imageUrl: 'https://via.placeholder.com/300x150/FF6347/FFFFFF?text=Event1' },
        { id: '2', title: '新ガチャカード登場！', imageUrl: 'https://via.placeholder.com/300x150/4682B4/FFFFFF?text=Gacha2' },
        { id: '3', title: '初心者応援キャンペーン！', imageUrl: 'https://via.placeholder.com/300x150/3CB371/FFFFFF?text=Beginner3' },
        { id: '4', title: 'ランキング上位を目指せ！', imageUrl: 'https://via.placeholder.com/300x150/DAA520/FFFFFF?text=Ranking4' },
        { id: '5', title: '開発者ブログ更新！', imageUrl: 'https://via.placeholder.com/300x150/9370DB/FFFFFF?text=DevBlog5' },
    ];

    return (
        <View style={homeStyles.fullScreenContainer}>
            <StatusBar style="auto" />
            <Text style={homeStyles.headerTitle}>ゲームタイトル</Text> {/* アプリのタイトル */}

            {/* ①～④のスクロール可能部分 */}
            <ScrollView style={homeStyles.scrollViewContent}>
                {/* ① 注目記事カルセル */}
                <ArticleCarousel articles={dummyArticles} />

                {/* ② 4つのタップボタン */}
                <NavigationButtons navigation={navigation} />

                {/* ③ 広告表示場所 */}
                <AdBanner />

                {/* ④ 各分野のランキング */}
                <RankingSection />

                <View style={{ height: 50 }} /> {/* スクロールコンテンツの最後にタブバー分の余白 */}
            </ScrollView>

            {/* ⑤ 下部タブナビゲーションはApp.jsのTab.Navigatorで実装されるため、ここには不要 */}
        </View>
    );
}

const homeStyles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        padding: 20,
        backgroundColor: '#6a0dad', // App.jsのヘッダー色に合わせる
        color: '#fff',
        textAlign: 'center',
        paddingTop: 50, // ステータスバーと被らないように
    },
    scrollViewContent: {
        flex: 1, // スクロール可能領域を確保
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 15,
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },

    // ① カルセルスタイル
    carouselContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    carouselItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200, // カルセルの高さ
    },
    carouselImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 5,
        resizeMode: 'cover',
    },
    carouselText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    carouselIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#6a0dad',
    },
    inactiveIndicator: {
        backgroundColor: '#ccc',
    },

    // ② ボタンスタタイル
    buttonGrid: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    navButton: {
        flex: 1, // 各ボタンが均等な幅を占める
        backgroundColor: '#4CAF50', // 緑系の色
        paddingVertical: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // ③ 広告スタイル
    adBannerContainer: {
        backgroundColor: '#ddd',
        height: 80,
        marginHorizontal: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    adBannerText: {
        fontSize: 18,
        color: '#666',
        fontWeight: 'bold',
    },

    // ④ ランキングスタイル
    rankingSection: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        borderRadius: 10,
        padding: 10,
        marginBottom: 15, // 下部タブバーとの余白
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    rankingTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    rankingTabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },
    activeRankingTab: {
        borderColor: '#6a0dad', // アクティブなタブの下線
    },
    rankingTabText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#555',
    },
    rankingList: {
        // paddingHorizontal: 10,
    },
    rankingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rankingItemRank: {
        fontSize: 15,
        fontWeight: 'bold',
        width: 30, // 順位表示の幅
        textAlign: 'center',
        color: '#333',
    },
    rankingItemName: {
        flex: 1,
        fontSize: 15,
        color: '#555',
        marginLeft: 10,
    },
    rankingItemScore: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#6a0dad',
    },
});