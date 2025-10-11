'use client';

import React from 'react';
import { X } from 'lucide-react';
import { LeaderboardModalProps } from '@/types/types';
import { getMotivationalMessage } from '@/constants/data';

export default function LeaderboardModal({
    isOpen,
    onClose,
    currentProgress,
}: LeaderboardModalProps) {
    if (!isOpen) return null;



    const motivation = getMotivationalMessage(currentProgress);

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40 w-screen h-screen" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full" dir="rtl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white rounded-t-lg">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-2xl font-bold">Leaderboard</h3>
                        </div>
                    </div>

                    {/* Motivational Content */}
                    <div className="p-8 text-center bg-gradient-to-b from-blue-50 to-white">
                        <div className="text-7xl mb-4">{motivation.emoji}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{motivation.title}</h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{motivation.message}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
