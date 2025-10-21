// PortfolioScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button,
} from 'react-native';
import { getQuote } from '../finnhub';

export default function PortfolioScreen({ route }) {
  const [portfolio, setPortfolio] = useState(route.params?.portfolio || []);
  const [loading, setLoading] = useState(false);
  const [updatedPortfolio, setUpdatedPortfolio] = useState([]);

  const fetchPrices = async () => {
    setLoading(true);
    const updated = await Promise.all(
      portfolio.map(async (item) => {
        const quote = await getQuote(item.symbol);
        const currentPrice = quote?.c || 0;
        const currentValue = currentPrice * item.quantity;
        const gainLoss = currentValue - item.totalCost;

        return {
          ...item,
          currentPrice,
          currentValue,
          gainLoss,
        };
      })
    );
    setUpdatedPortfolio(updated);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 My Portfolio</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : updatedPortfolio.length === 0 ? (
        <Text>You haven't bought any stocks yet.</Text>
      ) : (
        <FlatList
          data={updatedPortfolio}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text>Shares: {item.quantity}</Text>
              <Text>Avg Buy Price: ${item.avgPrice.toFixed(2)}</Text>
              <Text>Current Price: ${item.currentPrice.toFixed(2)}</Text>
              <Text>Value: ${item.currentValue.toFixed(2)}</Text>
              <Text style={{ color: item.gainLoss >= 0 ? 'green' : 'red' }}>
                Gain/Loss: ${item.gainLoss.toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}

      <Button title="Refresh Prices" onPress={fetchPrices} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginVertical: 10,
  },
  symbol: { fontSize: 18, fontWeight: 'bold' },
});

