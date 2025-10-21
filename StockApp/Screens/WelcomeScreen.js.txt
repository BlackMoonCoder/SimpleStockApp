import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AppContext } from '../App';

const GOALS = ['Retirement', 'Buy a Car', 'Travel', 'Emergency Fund', 'Other'];

export default function WelcomeScreen({ navigation }) {
  const { setGoal } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What's your investing goal?</Text>
      <FlatList
        data={GOALS}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setGoal(item);
              navigation.navigate('Portfolios');
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});
