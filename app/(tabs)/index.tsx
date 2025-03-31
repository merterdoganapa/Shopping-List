import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Alışveriş öğesi için bir tip tanımlayalım
type ShoppingItem = {
  id: string;
  name: string;
  completed: boolean;
};

export default function ShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  const addItem = () => {
    if (item.trim().length > 0) {
      setShoppingList([...shoppingList, { id: Date.now().toString(), name: item, completed: false }]);
      setItem('');
    }
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      "Ürünü Sil",
      "Bu ürünü silmek istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        { 
          text: "Sil", 
          onPress: () => setShoppingList(shoppingList.filter(item => item.id !== id)),
          style: "destructive"
        }
      ]
    );
  };

  const toggleItemCompletion = (id: string) => {
    setShoppingList(
      shoppingList.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <View style={[
      styles.container,
      {
        // insets.top değerini kullanmıyoruz çünkü header var
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right
      }
    ]}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Ürün ekle..."
          value={item}
          onChangeText={setItem}
        />
        <TouchableOpacity onPress={addItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shoppingList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => toggleItemCompletion(item.id)}
            onLongPress={() => deleteItem(item.id)}
          >
            <View style={styles.listItem}>
              <Text style={[
                styles.itemText,
                item.completed && styles.completedItem
              ]}>
                {item.name}
              </Text>
              {item.completed && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyText}>Alışveriş listeniz boş</Text>
            <Text style={styles.emptySubText}>Yeni ürün eklemek için yukarıdaki alanı kullanın</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#007bff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
  },
  completedItem: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkmark: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18,
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
});