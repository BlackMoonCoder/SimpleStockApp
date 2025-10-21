import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getQuote, getHistorical, searchStocks } from '../finnhub';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

export default function StockLookupScreen() {
  const [selected, setSelected] = useState('AAPL');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const navigation = useNavigation();

  const fetchStock = async () => {
    setLoading(true);
    const quote = await getQuote(selected);
    const hist = await getHistorical(selected, 'D', 7);
    setData(quote);
    setHistory(hist);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (query.length < 1) return;
    const matches = await searchStocks(query);
    setResults(matches.slice(0, 5));
  };

  useEffect(() => {
    fetchStock();
  }, [selected]);

  const buyShare = () => {
    if (!data?.c) return;

    const avgPrice = data.c;
    const symbol = selected;
    const quantity = 1;
    const totalCost = avgPrice * quantity;

    const existing = portfolio.find((s) => s.symbol === symbol);
    let updatedPortfolio;

    if (existing) {
      const newQty = existing.quantity + quantity;
      const newTotalCost = existing.totalCost + totalCost;
      const newAvg = newTotalCost / newQty;

      updatedPortfolio = portfolio.map((item) =>
        item.symbol === symbol
          ? { ...item, quantity: newQty, totalCost: newTotalCost, avgPrice: newAvg }
          : item
      );
    } else {
      updatedPortfolio = [
        ...portfolio,
        { symbol, quantity, avgPrice, totalCost },
      ];
    }

    setPortfolio(updatedPortfolio);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Lookup</Text>

      {/* Search Input */}
      <TextInput
        style={styles.input}
        placeholder="Search stock (e.g. AAPL, Tesla)"
        value={query}
        onChangeText={(text) => setQuery(text)}
        onSubmitEditing={handleSearch}
      />

      {/* Search Results */}
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.symbol}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => {
                setSelected(item.symbol);
                setQuery('');
                setResults([]);
              }}
            >
              <Text>{item.symbol} — {item.description}</Text>
            </TouchableOpacity>
          )}
          style={{ marginBottom: 10 }}
        />
      )}

      {/* Fallback Picker */}
      <Picker
        selectedValue={selected}
        onValueChange={(value) => setSelected(value)}
        style={styles.picker}
      >
        <Picker.Item label="Apple (AAPL)" value="AAPL" />
        <Picker.Item label="Tesla (TSLA)" value="TSLA" />
        <Picker.Item label="Amazon (AMZN)" value="AMZN" />
        <Picker.Item label="Microsoft (MSFT)" value="MSFT" />
        <Picker.Item label="Google (GOOG)" value="GOOG" />
      </Picker>

      {/* Stock Quote */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : data ? (
        <View style={styles.card}>
          <Text style={styles.symbol}>{selected}</Text>
          <Text>Current: ${data.c?.toFixed(2)}</Text>
          <Text>High: ${data.h?.toFixed(2)}</Text>
          <Text>Low: ${data.l?.toFixed(2)}</Text>
          <Text>Previous Close: ${data.pc?.toFixed(2)}</Text>
        </View>
      ) : (
        <Text>No data available</Text>
      )}

      {/* Historical Chart */}
      {history?.c ? (
        <LineChart
          data={{
            labels: history.t.map((ts) => {
              const date = new Date(ts * 1000);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }),
            datasets: [{ data: history.c }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: '#e0f0ff',
            backgroundGradientFrom: '#e0f0ff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: () => '#333',
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 10 }}
        />
      ) : null}

      {/* Buy and Portfolio Buttons */}
      <Button title="Buy 1 Share" onPress={buyShare} />
      <View style={{ height: 10 }} />
      <Button
        title="Go to Portfolio"
        onPress={() => navigation.navigate('Portfolio', { portfolio })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  resultItem: {
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  picker: { marginVertical: 10 },
  card: {
    padding: 15,
    backgroundColor: '#e0f0ff',
    borderRadius: 8,
    marginVertical: 20,
  },
  symbol: { fontSize: 18, fontWeight: 'bold' },
});
