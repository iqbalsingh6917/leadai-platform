import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { MOCK_LEADS } from '@/services/api';
import type { CopilotMessage } from '@/types';

const SUGGESTED = [
  "Who are my hottest leads?",
  "Summarize this week's pipeline",
  "What should I focus on today?",
  "Which leads haven't been contacted?",
];

function generateMockReply(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('hot') || lower.includes('score')) {
    const top = MOCK_LEADS.filter(l => l.score >= 80).slice(0, 3);
    return `🔥 Your top 3 hottest leads right now:\n\n${top.map(l => `• ${l.name} — Score: ${l.score} (${l.source})`).join('\n')}\n\nI'd recommend calling Priya Sharma first — she has the highest score and is in the Negotiation stage.`;
  }
  if (lower.includes('pipeline') || lower.includes('week')) {
    return `📊 Pipeline Summary (This Week):\n\n• New leads: 12\n• Qualified: 8\n• In negotiation: 5\n• Won: 3 deals (₹1.2L)\n\nPipeline velocity is up 12% vs last week. Deepa Nair and Harish Menon are most likely to convert in the next 48 hours.`;
  }
  if (lower.includes('focus') || lower.includes('today')) {
    return `✅ Here's your focus list for today:\n\n1. 📞 Call Priya Sharma (score 92 — hasn't been called in 2 days)\n2. 💬 WhatsApp Deepa Nair (opened proposal 3x)\n3. ✉️ Follow up with Suresh Kumar (demo scheduled)\n4. 🤖 Review 4 new auto-scored leads\n\nYou have 3 leads at risk of going cold — want me to draft follow-up messages?`;
  }
  if (lower.includes('contact') || lower.includes('reach')) {
    const uncontacted = MOCK_LEADS.filter(l => l.status === 'new').slice(0, 4);
    return `⚠️ Leads not yet contacted:\n\n${uncontacted.map(l => `• ${l.name} — ${l.source}, ${l.score} score`).join('\n')}\n\nRecommendation: Prioritize Meena Joshi (Facebook) and start with a WhatsApp message.`;
  }
  return `Got it! I'm analyzing your CRM data to answer: "${msg}"\n\nBased on your current pipeline, I can see opportunities to:\n• Increase follow-up frequency for warm leads\n• Use AI scoring to prioritize outreach\n• Automate 3 repetitive tasks\n\nWant me to dive deeper into any of these?`;
}

export default function CopilotScreen() {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm your LeadAI Copilot 🤖\n\nI can help you analyze leads, prioritize your pipeline, draft messages, and give you AI-powered insights. What would you like to know?",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockReply(trimmed),
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>✦ AI Copilot</Text>
        <Text style={styles.subtitle}>Powered by LeadAI</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.role === 'user' ? styles.userBubble : styles.assistantBubble,
              ]}
            >
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>
                {msg.content}
              </Text>
            </View>
          ))}
          {isTyping && (
            <View style={styles.assistantBubble}>
              <Text style={styles.typingIndicator}>● ● ●</Text>
            </View>
          )}
        </ScrollView>

        {/* Suggested Questions */}
        <FlatList
          horizontal
          data={SUGGESTED}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestion}
              onPress={() => sendMessage(item)}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContent}
          style={styles.suggestionsList}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Ask your AI copilot..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: { padding: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, gap: 10, paddingBottom: 8 },
  bubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  bubbleText: { fontSize: 14, lineHeight: 20, color: Colors.text },
  userBubbleText: { color: '#fff' },
  typingIndicator: { fontSize: 18, color: Colors.textSecondary, letterSpacing: 4 },
  suggestionsList: { maxHeight: 46, borderTopWidth: 1, borderTopColor: Colors.border },
  suggestionsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8, alignItems: 'center' },
  suggestion: {
    backgroundColor: '#eef2ff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  suggestionText: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendIcon: { fontSize: 20, color: '#fff', fontWeight: '700' },
});
