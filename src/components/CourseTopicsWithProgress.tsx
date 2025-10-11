'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Lock, FileText, CheckCircle, PlayCircle, Clock } from 'lucide-react';
import { CourseTopicsWithProgressProps, Topic } from '@/types/types';

export default function CourseTopicsWithProgress({
    topics,
    videoProgress,
    onVideoSelect,
    currentVideoId,
    videoDurations = {},
}: CourseTopicsWithProgressProps) {
    const [expandedTopics, setExpandedTopics] = useState<number[]>([0]);

    const calculateSectionDuration = useMemo(() => {
        return (topic: Topic): string => {
            const totalSeconds = topic.videos.reduce((sum, video) => {
                const duration = videoDurations[video.id] || 0;
                return sum + duration;
            }, 0);

            if (totalSeconds === 0) return '';

            const hours = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3600) / 60);
            const secs = Math.floor(totalSeconds % 60);

            if (hours > 0) {
                return `${hours}h ${mins}m`;
            } else if (mins > 0) {
                return `${mins}m ${secs}s`;
            } else {
                return `${secs}s`;
            }
        };
    }, [videoDurations]);

    const calculateOverallProgress = () => {
        const allVideos = topics.flatMap((topic) => topic.videos);
        const watchedVideos = allVideos.filter((video) => videoProgress[video.id]?.watched).length;
        return allVideos.length > 0 ? Math.round((watchedVideos / allVideos.length) * 100) : 0;
    };

    const overallProgress = calculateOverallProgress();

    const toggleTopic = (index: number) => {
        setExpandedTopics((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-12">Topics for This Course</h2>

            <div className="mb-8">
                <div className="relative mb-2">
                    <div
                        className="absolute -top-12 transform -translate-x-1/2 flex flex-col items-center z-10"
                        style={{ left: `${overallProgress}%` }}
                    >
                        <div className="size-10 flex items-center justify-center bg-white border border-gray-300 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                            You
                        </div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-300 mt-0.5" />
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-teal-500 transition-all duration-300"
                            style={{ width: `${overallProgress}%` }}
                        />
                    </div>
                </div>
                <p className="text-sm text-gray-600 text-right">{overallProgress}%</p>
            </div>

            <div className="space-y-4">
                {topics.map((topic, index) => {
                    const sectionDuration = calculateSectionDuration(topic);

                    return (
                        <div key={topic.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleTopic(index)}
                                className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{topic.week}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                                        {/* Section Total Duration */}
                                        {sectionDuration && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <span>{sectionDuration}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 pt-1">
                                        {expandedTopics.includes(index) ? (
                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                        )}
                                    </div>
                                </div>
                            </button>

                            {expandedTopics.includes(index) && (
                                <div className="border-t border-gray-200 divide-y divide-gray-200 bg-white">
                                    {topic.videos.map((video) => {
                                        const progress = videoProgress[video.id];
                                        const isWatched = progress?.watched || false;
                                        const isCurrent = currentVideoId === video.id;

                                        return (
                                            <button
                                                key={video.id}
                                                onClick={() => onVideoSelect(video.id, video.url)}
                                                disabled={video.locked}
                                                className={`w-full px-4 py-3 flex items-center justify-between transition-colors text-left ${isCurrent ? 'bg-teal-50' : ''
                                                    } ${video.locked
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : 'hover:bg-gray-50 cursor-pointer'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    {isWatched ? (
                                                        <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                                    ) : isCurrent ? (
                                                        <PlayCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                                    ) : (
                                                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    )}
                                                    <span
                                                        className={`text-sm ${isCurrent ? 'text-teal-600 font-medium' : 'text-gray-700'
                                                            }`}
                                                    >
                                                        {video.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {video.locked && <Lock className="w-4 h-4 text-gray-400 ml-1" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
