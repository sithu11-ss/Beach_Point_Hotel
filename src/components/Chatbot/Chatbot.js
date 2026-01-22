import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import Card from '../UI/Card';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your virtual assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const responses = {
    'hello': "Hello! Welcome to Beach Point Luxe Resort. How can I assist you?",
    'hi': "Hi there! I'm here to help with your questions about our resort.",
    'book': "You can book a room by clicking the 'Book Now' button in the navigation or visiting the Rooms page. Would you like to know about our available rooms?",
    'room': "We offer several room types: Ocean View Suite ($350/night), Beachfront Villa ($650/night), Deluxe Room ($220/night), and Presidential Suite ($1200/night). Which one interests you?",
    'restaurant': "Our restaurant offers fine dining with ocean views. You can view our menu and make a reservation on the Restaurant page. We serve breakfast, lunch, and dinner.",
    'check-in': "You can complete your check-in online through our Digital Check-In page. You'll need your booking reference and ID document.",
    'check-out': "Digital check-out is available on our Check-Out page. Just enter your booking reference to generate your final bill.",
    'amenities': "Our resort features luxury accommodations, fine dining, spa & wellness center, and direct beach access. What would you like to know more about?",
    'price': "Room prices start from $220/night for our Deluxe Room. Our most luxurious option is the Presidential Suite at $1200/night. Would you like to see all available rooms?",
    'contact': "You can reach us through our website or by email. For immediate assistance, please use the contact form or call our front desk.",
    'default': "I'm here to help with booking, room information, restaurant reservations, check-in/check-out, and general inquiries. What would you like to know?"
  };

  const getResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(input),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-ocean-blue text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-opacity-90 transition-colors"
        aria-label="Open chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <FiX size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <FiMessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50"
          >
            <Card glass className="h-full flex flex-col p-0 overflow-hidden">
              {/* Header */}
              <div className="bg-ocean-blue/90 backdrop-blur-md p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-heading font-semibold">Beach Point Luxe</h3>
                    <p className="text-white/80 text-sm">Virtual Assistant</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-soft-gold transition-colors"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-ocean-blue text-white'
                          : 'bg-white/80 text-charcoal'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/20">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-ocean-blue text-sm"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-ocean-blue text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors"
                  >
                    <FiSend size={18} />
                  </motion.button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

