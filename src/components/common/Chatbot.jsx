import React, { useState, useEffect, useRef } from 'react';
import { aiApi } from '../../services/api'; // Import the AI API functions
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hi! How can I help you with clubs and events at the university today?' }
    ]);
    
    // Ref for scrolling to the bottom of the chat
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { from: 'user', text: input };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInput('');
        setIsLoading(true);

        try {
            // --- Real Gemini API call ---
            const response = await aiApi.getChatbotResponse(input, messages);
            const botResponse = { from: 'bot', text: response.data.response };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorResponse = { from: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* --- Chat Window --- */}
            {isOpen && (
                <div className="fixed bottom-24 right-4 sm:right-8 w-80 sm:w-96 h-[32rem] bg-card border border-border rounded-xl shadow-2xl flex flex-col animate-fade-in-up z-50">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-border">
                        <h3 className="font-bold text-primary flex items-center gap-2"><Bot size={20} /> StellarHub Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-secondary hover:text-primary">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                                {msg.from === 'bot' && <div className="bg-accent text-white p-2 rounded-full flex-shrink-0"><Bot size={16} /></div>}
                                <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.from === 'bot' ? 'bg-background text-primary rounded-bl-none' : 'bg-accent text-white rounded-br-none'}`}>
                                    <p className="text-sm break-words">{msg.text}</p>
                                </div>
                                {msg.from === 'user' && <div className="bg-gray-700 text-white p-2 rounded-full flex-shrink-0"><User size={16} /></div>}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="bg-accent text-white p-2 rounded-full flex-shrink-0"><Bot size={16} /></div>
                                <div className="max-w-xs px-4 py-2 rounded-2xl bg-background text-primary rounded-bl-none">
                                    <Loader2 className="animate-spin" size={20} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSend} className="p-4 border-t border-border flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about clubs or events..."
                            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-accent"
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-accent text-white p-3 rounded-lg hover:bg-accent-hover disabled:bg-gray-500" disabled={isLoading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* --- Floating Action Button --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-4 sm:right-8 bg-accent text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-accent-hover transition-transform hover:scale-110 z-50"
                aria-label="Toggle Chatbot"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </>
    );
};

export default Chatbot;
