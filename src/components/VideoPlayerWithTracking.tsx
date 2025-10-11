'use client';

import { VideoPlayerWithTrackingProps } from '@/types/types';
import React, { useRef, useEffect } from 'react';

export default function VideoPlayerWithTracking({
    videoUrl,
    videoId,
    onProgressUpdate,
    onVideoEnd,
    initialProgress = 0,
}: VideoPlayerWithTrackingProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hasMarkedWatchedRef = useRef(false);
    const hasSentDurationRef = useRef(false);

    useEffect(() => {
        hasMarkedWatchedRef.current = false;
        hasSentDurationRef.current = false;
    }, [videoId]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const progress = (video.currentTime / video.duration) * 100;

            if (progress >= 80 && !hasMarkedWatchedRef.current) {
                hasMarkedWatchedRef.current = true;
                onProgressUpdate(videoId, progress, true, video.duration);
            } else {
                onProgressUpdate(videoId, progress, hasMarkedWatchedRef.current, video.duration);
            }
        };

        const handleEnded = () => {
            onProgressUpdate(videoId, 100, true, video.duration);
            onVideoEnd();
        };

        const handleLoadedMetadata = () => {
            if (!hasSentDurationRef.current && video.duration) {
                hasSentDurationRef.current = true;
                onProgressUpdate(videoId, 0, false, video.duration);
            }

            if (initialProgress > 0 && initialProgress < 100) {
                video.currentTime = (initialProgress / 100) * video.duration;
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [videoId, videoUrl, onProgressUpdate, onVideoEnd, initialProgress]);

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full h-full"
                controlsList="nodownload"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
