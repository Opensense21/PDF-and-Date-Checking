import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { MessageSquare, Send, Bot, User, Loader2, Calendar, Sparkles } from 'lucide-react';
import { searchAuspiciousDays } from '../lib/cultural';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const searchAuspiciousDaysTool: FunctionDeclaration = {
  name: "searchAuspiciousDays",
  description: "Search for Hoàng Đạo (auspicious) or Hắc Đạo (inauspicious) days in a specific solar month and year.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      month: {
        type: Type.NUMBER,
        description: "The solar month (1-12).",
      },
      year: {
        type: Type.NUMBER,
        description: "The solar year (e.g., 2026).",
      },
      type: {
        type: Type.STRING,
        description: "The type of day to search for: 'Hoàng Đạo' or 'Hắc Đạo'. Optional.",
        enum: ["Hoàng Đạo", "Hắc Đạo"]
      }
    },
    required: ["month", "year"]
  }
};

export const ChatLookup: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Xin chào! Tôi có thể giúp bạn tra cứu ngày Hoàng Đạo, Hắc Đạo hoặc các thông tin văn hóa khác. Bạn muốn tìm gì?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";

      const response = await ai.models.generateContent({
        model,
        contents: messages.concat({ role: 'user', text: userMessage }).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          tools: [{ functionDeclarations: [searchAuspiciousDaysTool] }],
          systemInstruction: "Bạn là một chuyên gia về văn hóa Việt Nam và lịch vạn niên. Hãy giúp người dùng tra cứu ngày Hoàng Đạo, Hắc Đạo. Khi người dùng hỏi về danh sách ngày trong tháng, hãy sử dụng công cụ searchAuspiciousDays. Trả lời bằng tiếng Việt thân thiện, trang trọng."
        }
      });

      const modelContent = response.candidates?.[0]?.content;
      const functionCalls = response.functionCalls;

      if (functionCalls && modelContent) {
        const call = functionCalls[0];
        if (call.name === 'searchAuspiciousDays') {
          const args = call.args as any;
          const results = searchAuspiciousDays(args.month, args.year, args.type);
          
          // Send back the tool result
          const secondResponse = await ai.models.generateContent({
            model,
            contents: [
              ...messages.concat({ role: 'user', text: userMessage }).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
              })),
              modelContent, // Preserve the model's original content (including thoughts/IDs)
              {
                role: 'user',
                parts: [{
                  functionResponse: {
                    name: 'searchAuspiciousDays',
                    response: { content: JSON.stringify(results) },
                    id: call.id // Include the function call ID
                  }
                }]
              }
            ],
            config: {
              systemInstruction: "Bạn là một chuyên gia về văn hóa Việt Nam. Dựa trên dữ liệu trả về, hãy tổng hợp và trình bày danh sách ngày Hoàng Đạo/Hắc Đạo một cách rõ ràng, dễ đọc cho người dùng."
            }
          });

          setMessages(prev => [...prev, { role: 'model', text: secondResponse.text || 'Xin lỗi, tôi không thể xử lý yêu cầu này.' }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: response.text || 'Xin lỗi, tôi không thể xử lý yêu cầu này.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Đã có lỗi xảy ra khi kết nối với trí tuệ nhân tạo. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Trợ Lý Văn Hóa</h3>
          <p className="text-xs text-amber-100">Tra cứu lịch vạn niên & phong thủy</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
      >
        {messages.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-amber-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-amber-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-amber-600 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ví dụ: Liệt kê các ngày Hoàng Đạo trong tháng 4/2026..."
            className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            "Ngày Hoàng Đạo tháng 4/2026",
            "Ngày Hắc Đạo tháng 11/2026",
            "Hôm nay có tốt không?"
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-medium rounded-full border border-amber-100 hover:bg-amber-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
