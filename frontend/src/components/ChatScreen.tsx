
import { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Heart, 
  BookOpen, 
  Navigation, 
  Briefcase, 
  Target,
  Send,
  Mic,
  Paperclip,
  Smile,
  ArrowLeft,
  Sparkles,
  User,
  Bot
} from 'lucide-react';

interface ChatScreenProps {
  onNavigate: (screen: string) => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'mira';
  timestamp: Date;
  mode?: string;
}

interface ChatMode {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  placeholder: string;
}

const chatModes: ChatMode[] = [
  {
    id: 'emotional',
    name: 'Emotional Support',
    icon: Heart,
    color: 'rose',
    description: 'Mood check-ins, journaling, grounding techniques',
    placeholder: 'How are you feeling today? I\'m here to listen...'
  },
  {
    id: 'learning',
    name: 'Guided Learning',
    icon: BookOpen,
    color: 'blue',
    description: 'Learn Web3, budgeting, wallet usage',
    placeholder: 'What would you like to learn about today?'
  },
  {
    id: 'decisions',
    name: 'Decision Help',
    icon: Navigation,
    color: 'green',
    description: 'Get guidance on important choices',
    placeholder: 'What decision are you thinking about?'
  },
  {
    id: 'career',
    name: 'Job Readiness',
    icon: Briefcase,
    color: 'purple',
    description: 'Resume tips, interview practice, confidence building',
    placeholder: 'Let\'s work on your career goals together'
  },
  {
    id: 'goals',
    name: 'Goal Assistant',
    icon: Target,
    color: 'amber',
    description: 'Set and achieve micro-goals',
    placeholder: 'What small step would you like to take today?'
  }
];

const sampleResponses = {
  emotional: [
    "I hear you, and your feelings are completely valid. It's okay to take things one step at a time. 💜",
    "Thank you for sharing that with me. You're being so brave by acknowledging how you feel.",
    "Remember, healing isn't linear. Some days will be harder than others, and that's perfectly normal."
  ],
  learning: [
    "Great question! Let me break that down in simple terms. Your wallet is like a digital safe that only you control.",
    "Budgeting can feel overwhelming, but let's start small. Even saving $1 a day adds up to real progress.",
    "Web3 might sound complex, but think of it as the internet where you truly own your digital things."
  ],
  decisions: [
    "That's a thoughtful question. Let's think through this together. What feels most aligned with your values?",
    "Consider your safety first, then your goals. What option gives you the most control over your situation?",
    "Trust your instincts. You know yourself better than anyone else."
  ],
  career: [
    "Your experiences have given you unique strengths. Let's highlight those in a way that shows your resilience.",
    "Practice makes progress. Would you like to do a quick mock interview question together?",
    "Every small step toward employment is worth celebrating. You're building something meaningful."
  ],
  goals: [
    "I love that goal! Let's break it into even smaller steps. What's one tiny action you could take today?",
    "Progress isn't always visible, but you're doing amazing work. Keep going, one day at a time.",
    "That's a perfect micro-goal. Small wins build big changes over time."
  ]
};

export const ChatScreen = ({ onNavigate }: ChatScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello beautiful soul 🌸 I'm MIRA, your gentle companion. I'm here to support you in whatever way feels right today. How can I help you on your journey?",
      sender: 'mira',
      timestamp: new Date()
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState<ChatMode | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      mode: selectedMode?.id
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = selectedMode 
        ? sampleResponses[selectedMode.id as keyof typeof sampleResponses] 
        : sampleResponses.emotional;
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const miraMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse,
        sender: 'mira',
        timestamp: new Date(),
        mode: selectedMode?.id
      };

      setMessages(prev => [...prev, miraMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-rose-50 to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('wallet')}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-purple-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-rose-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">MIRA</h1>
                  <p className="text-sm text-purple-600">Your Gentle Guide</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Always here for you</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Chat Modes Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 h-full">
              <h3 className="font-semibold text-gray-900 mb-4">Support Modes</h3>
              <div className="space-y-3">
                {chatModes.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = selectedMode?.id === mode.id;
                  
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setSelectedMode(mode)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        isSelected
                          ? `bg-${mode.color}-100 border-2 border-${mode.color}-300`
                          : 'bg-white/50 hover:bg-white/80 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className={`w-4 h-4 ${isSelected ? `text-${mode.color}-600` : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${isSelected ? `text-${mode.color}-700` : 'text-gray-700'}`}>
                          {mode.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{mode.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-purple-100' 
                            : 'bg-gradient-to-r from-purple-400 to-rose-400'
                        }`}>
                          {message.sender === 'user' 
                            ? <User className="w-4 h-4 text-purple-600" />
                            : <Bot className="w-4 h-4 text-white" />
                          }
                        </div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-purple-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-rose-400 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-white border border-purple-100">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-purple-100">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={selectedMode?.placeholder || "Share what's on your mind..."}
                      className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim()}
                      className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
