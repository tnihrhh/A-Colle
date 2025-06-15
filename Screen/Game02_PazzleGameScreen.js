import { View, Text, StyleSheet } from 'react-native';

export default function NewsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>パズルゲーム</Text>
            <Text style={styles.coming}>coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    coming: {
        fontSize: 18,
        color:"gray",
    }
});