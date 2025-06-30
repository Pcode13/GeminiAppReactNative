// App.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyBlZmcyPZs-yknNpiqfi5wb80V_g_KoYn4'; // ⚠️ Replace with your key

const App = () => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    [],
  );
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: input }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const aiText = response.data.candidates[0].content.parts[0].text;
      const botMessage = { role: 'bot', text: aiText };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('❌ Gemini API error:', err);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Something went wrong. Please try again later.' },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content" // Or "light-content" depending on your background
        backgroundColor="#ffffff" // For Android, sets the status bar background color
        translucent={false} // Set to true if you want content to draw under it
      />
      <Text style={styles.header}>🤖 Gemini Chatbot</Text>
      <ScrollView
        style={styles.chat}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[
              styles.message,
              msg.role === 'user' ? styles.userMsg : styles.botMsg,
            ]}
          >
            <Text style={{ color: '#000' }}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  chat: { flex: 1, marginVertical: 10 },
  message: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMsg: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
  },
  botMsg: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e3e5',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  input: {
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
});
