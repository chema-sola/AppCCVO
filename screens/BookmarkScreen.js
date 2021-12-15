import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const BookmarkScreen = () => {
    return (
      <View style={styles.container}>
        <Text>Lista de Equipos</Text>
        <Button
          title="Lista de Equipos"
          onPress={() => alert('Mostrar Equipos!')}
        />
      </View>
    );
};

export default BookmarkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
