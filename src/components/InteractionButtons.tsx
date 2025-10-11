'use client';

import React, { useState } from 'react';
import { MessageCircle, HelpCircle, Trophy } from 'lucide-react';
import LeaderboardModal from './LeaderboardModal';
import ExamModal from './ExamModal';
import { InteractionButtonsProps } from '@/types/types';

export default function InteractionButtons({
    currentProgress,
    currentSection,
    onExamComplete,
}: InteractionButtonsProps) {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showExam, setShowExam] = useState(false);

    const scrollToComments = () => {
        const commentsSection = document.getElementById('comments-section');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleOpenExam = () => {
        if (currentSection?.hasExam && currentSection?.examQuestions) {
            setShowExam(true);
        }
    };

    const handleExamComplete = (score: number) => {
        onExamComplete(score);
    };

    return (
        <>
            <div className="flex items-center gap-3">
                <button
                    onClick={scrollToComments}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Go to comments"
                >
                    <MessageCircle className="w-5 h-5 text-gray-700" />
                    <span className="text-sm font-medium text-gray-700">Comments</span>
                </button>

                {currentSection?.hasExam && (
                    <button
                        onClick={handleOpenExam}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        title="Take section exam"
                    >
                        <HelpCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Questions</span>
                    </button>
                )}

                <button
                    onClick={() => setShowLeaderboard(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:shadow-lg text-white rounded-lg transition-all"
                    title="View leaderboard"
                >
                    <Trophy className="w-5 h-5" />
                    <span className="text-sm font-medium">Leaderboard</span>
                </button>
            </div>

            <LeaderboardModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                currentProgress={currentProgress}
            />

            {currentSection?.hasExam && currentSection?.examQuestions && (
                <ExamModal
                    isOpen={showExam}
                    onClose={() => setShowExam(false)}
                    sectionTitle={currentSection.week}
                    questions={currentSection.examQuestions}
                    onComplete={handleExamComplete}
                />
            )}
        </>
    );
}
