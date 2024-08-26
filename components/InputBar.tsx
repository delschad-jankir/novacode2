// InputBar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Send } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface Message {
  text: string;
  type: 'user' | 'response';
}

interface InputBarFormValues {
  message: string;
}

const InputBar: React.FC = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<InputBarFormValues>({
    defaultValues: {
      message: ''
    },
    mode: 'onChange'
  });

  const { register, handleSubmit, reset } = form;

  // Scroll to the bottom of the messages container when messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit: SubmitHandler<InputBarFormValues> = async (data) => {
    if (data.message.trim() === '') return;

    setMessages([...messages, { text: data.message, type: 'user' }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/chatInformation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: data.message }),
      });

      const responseData = await res.json();
      setMessages(prev => [...prev, { text: responseData.message, type: 'response' }]);
    } catch (error) {
      console.error('Error sending chat information:', error);
      setMessages(prev => [...prev, { text: 'Error fetching response', type: 'response' }]);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div>
      <div>
        <div className="flex flex-col gap-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-200 text-black self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <p className="text-gray-500">Loading...</p>}
          {/* <div ref={messagesEndRef} /> */}
        </div>
      </div>
      <div className="border-t bg-background sticky bottom-0 left-0 right-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4">
            <label className="sr-only">Message</label>
            <div className="relative flex items-center w-full">
              <textarea
                {...register("message")}
                className={`h-12 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-auto ${
                  theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-200'
                }`}
                placeholder="Type your message..."
                disabled={loading}
                rows={1}
              />
              <button
                type="submit"
                disabled={loading}
                className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer group hover:text-blue-500 transition-colors duration-300 ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBar;
