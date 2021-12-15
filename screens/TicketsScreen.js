import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TicketsScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Pantalla de Tickets</Text>
        <Button
            title="Ir a la pantalla de detalles ... de nuevo"
            onPress={() => navigation.push("Tickets")}
        />
        <Button
            title="Ir Página Principal"
            onPress={() => navigation.navigate("Home")}
        />
        <Button
            title="Volver Atras"
            onPress={() => navigation.goBack()}
        />
      </View>
    );
};

export default TicketsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
