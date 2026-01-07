'use client';

import { useState, useEffect } from 'react';

interface Message {
    _id: string;
    email: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMessages() {
            try {
                // We reuse the generic implementation or create a specific GET endpoint?
                // For simplicity, let's create a specific API Endpoint for this page in a moment
                // Assuming /api/admin/messages exists
                const res = await fetch('/api/admin/messages');
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        }
        fetchMessages();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold font-playfair mb-8">Inbox</h1>

            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                        <div className="bg-gray-700/50 p-4 rounded-full mb-4">
                            <span className="text-2xl">📭</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Inbox Zero</h3>
                        <p>No messages yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {messages.map((msg) => (
                            <div key={msg._id} className="p-6 hover:bg-gray-700/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-white text-lg">{msg.email}</h3>
                                        {!msg.isRead && (
                                            <span className="bg-blue-500 text-xs px-2 py-0.5 rounded-full text-white font-bold">NEW</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
