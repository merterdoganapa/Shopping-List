// app/index.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

// Alışveriş öğesi için bir tip tanımlayalım
type ShoppingItem = {
  id: string;
  name: string;
  completed: boolean;
};

// Storage için kullanacağımız anahtar
const STORAGE_KEY = '@shopping_list_items';

export default function ShoppingListScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [item, setItem] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Uygulama başlatıldığında verileri getir
  useEffect(() => {
    loadShoppingList();
  }, []);

  // Alışveriş listesi değiştiğinde kaydet
  useEffect(() => {
    if (!isLoading) {
      saveShoppingList();
    }
  }, [shoppingList]);

  // AsyncStorage'dan verileri yükle
  const loadShoppingList = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setShoppingList(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error('Veriler yüklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Alışveriş listesi yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // AsyncStorage'a verileri kaydet
  const saveShoppingList = async () => {
    try {
      const jsonValue = JSON.stringify(shoppingList);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Veriler kaydedilirken hata oluştu:', error);
      Alert.alert('Hata', 'Alışveriş listesi kaydedilirken bir sorun oluştu.');
    }
  };

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

  if (isLoading) {
    return (
      <View style={[
        styles.container, 
        styles.centered,
        { backgroundColor: theme.background }
      ]}>
        <Text style={{ color: theme.text }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: theme.background
      }
    ]}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={[
            styles.input,
            { 
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
              color: theme.inputText
            }
          ]}
          placeholder="Ürün ekle..."
          placeholderTextColor={theme.secondaryText}
          value={item}
          onChangeText={setItem}
        />
        <TouchableOpacity 
          onPress={addItem} 
          style={[styles.addButton, { backgroundColor: theme.primary }]}
        >
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
            <View style={[
              styles.listItem, 
              { 
                backgroundColor: theme.card,
                borderLeftColor: theme.primary,
                borderBottomColor: theme.border
              }
            ]}>
              <Text style={[
                styles.itemText,
                { color: theme.text },
                item.completed && styles.completedItem
              ]}>
                {item.name}
              </Text>
              {item.completed && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
              Alışveriş listeniz boş
            </Text>
            <Text style={[styles.emptySubText, { color: theme.secondaryText }]}>
              Yeni ürün eklemek için yukarıdaki alanı kullanın
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  addButton: {
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
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 5,
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
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 10,
  },
});