'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Question, QuestionsModalProps } from '@/types/types';

export default function QuestionsModal({ isOpen, onClose }: QuestionsModalProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    if (!isOpen) return null;

    const questions: Question[] = [
        {
            id: 1,
            question: 'What is the main feature of Next.js?',
            options: [
                'Server-side rendering',
                'Mobile development',
                'Database management',
                'Image editing',
            ],
            correctAnswer: 0,
        },
        {
            id: 2,
            question: 'Which hook is used for state management in React?',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 1,
        },
    ];

    const handleAnswerSelect = (index: number) => {
        setSelectedAnswer(index);
    };

    const handleNext = () => {
        if (selectedAnswer === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                    <div className="bg-blue-500 p-6 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">📝 Quiz Time!</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {!showResult ? (
                            <>
                                <div className="mb-4">
                                    <span className="text-sm text-gray-500">
                                        Question {currentQuestion + 1} of {questions.length}
                                    </span>
                                    <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all"
                                            style={{
                                                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    {questions[currentQuestion].question}
                                </h3>

                                <div className="space-y-3">
                                    {questions[currentQuestion].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerSelect(index)}
                                            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswer === index
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={selectedAnswer === null}
                                    className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                                >
                                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                </button>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">
                                    {score === questions.length ? '🎉' : score > questions.length / 2 ? '👍' : '📚'}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
                                <p className="text-lg text-gray-600 mb-6">
                                    You scored {score} out of {questions.length}
                                </p>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={handleReset}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
