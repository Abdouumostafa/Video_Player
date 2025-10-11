'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, ChevronLeft } from 'lucide-react';
import { ExamModalProps } from '@/types/types';


export default function ExamModal({
    isOpen,
    onClose,
    questions,
    onComplete,
}: ExamModalProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(600);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!isOpen || isFinished) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, isFinished]);

    useEffect(() => {
        if (isOpen) {
            setCurrentQuestion(0);
            setSelectedAnswer(null);
            setAnswers([]);
            setTimeLeft(600);
            setIsFinished(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionClick = (optionIndex: number) => {
        setSelectedAnswer(optionIndex);

        setTimeout(() => {
            const newAnswers = [...answers];
            newAnswers[currentQuestion] = optionIndex;
            setAnswers(newAnswers);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            } else {
                handleFinish(newAnswers);
            }
        }, 500);
    };

    const handleFinish = (finalAnswers = answers) => {
        setIsFinished(true);
        const score = finalAnswers.filter(
            (answer, index) => answer === questions[index].correctAnswer
        ).length;
        onComplete(score);
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(answers[currentQuestion - 1] ?? null);
        }
    };

    if (isFinished) {
        const score = answers.filter(
            (answer, index) => answer === questions[index].correctAnswer
        ).length;
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <>
                <div className="fixed inset-0 bg-black/60 z-40" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl text-white text-center">
                            <h3 className="text-2xl font-bold">نتيجة الامتحان</h3>
                        </div>
                        <div className="p-8 text-center">
                            <div className="text-6xl mb-4">
                                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
                            </div>
                            <h4 className="text-3xl font-bold text-gray-900 mb-2">{percentage}%</h4>
                            <p className="text-gray-600 mb-6">
                                {score} من {questions.length} إجابات صحيحة
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                    <div className="p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={handleBack}
                                disabled={currentQuestion === 0}
                                className="text-white disabled:opacity-30 hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full">
                                <Clock className="w-5 h-5 text-gray-800" />
                                <span className="font-bold text-gray-800 text-lg">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>

                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex justify-center gap-2 md:gap-3 mb-4">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition-all ${index === currentQuestion
                                        ? 'bg-white text-blue-600 scale-110'
                                        : answers[index] !== undefined
                                            ? 'bg-blue-400 text-white'
                                            : 'bg-blue-500/50 text-white border-2 border-white/50'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-t-3xl p-6 md:p-8 min-h-[400px]">
                        <div className="mb-6">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                {currentQuestion + 1}. {questions[currentQuestion].question}
                            </h3>

                            {/* Options */}
                            <div className="space-y-3">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionClick(index)}
                                        className={`w-full p-4 md:p-5 text-left rounded-xl border-2 transition-all text-base md:text-lg ${selectedAnswer === index
                                            ? 'border-blue-600 bg-blue-50 scale-[1.02]'
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${selectedAnswer === index
                                                    ? 'border-blue-600 bg-blue-600'
                                                    : 'border-gray-300'
                                                    }`}
                                            >
                                                {selectedAnswer === index && (
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="3"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-700">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
