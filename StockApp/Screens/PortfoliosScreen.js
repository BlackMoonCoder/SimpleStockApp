import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../App';

const portfolios = [
  { name: 'Tech Starter', desc: 'Big tech companies to begin with.' },
  { name: 'Safe & Slow', desc: 'Low volatility dividend stocks.' },
  { name: 'Green Energy', desc: 'Sustainable, ethical investing.' },
];

export default function PortfoliosScreen({ navigation }) {
  const { goal } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Goal: {goal}</Text>
      <FlatList
        data={portfolios}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Portfolio')}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  item: { padding: 15, marginBottom: 10, backgroundColor: '#eee', borderRadius: 5 },
  name: { fontWeight: 'bold' },
  desc: { fontSize: 12 },
});
