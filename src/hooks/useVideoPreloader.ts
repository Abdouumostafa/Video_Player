'use client';

import { Video } from '@/types/types';
import { useEffect, useState } from 'react';

export const useVideoPreloader = (videos: Video[], existingDurations: Record<string, number>) => {
    const [durations, setDurations] = useState<Record<string, number>>(existingDurations);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const videosToLoad = videos.filter(
            (video) => !video.isExam && !existingDurations[video.id] && !durations[video.id]
        );

        if (videosToLoad.length === 0) {
            setLoading(false);
            return;
        }

        const loadDurations = async () => {
            setLoading(true);
            const newDurations: Record<string, number> = { ...existingDurations };
            let hasChanges = false;

            const promises = videosToLoad.map((video) => {
                return new Promise<void>((resolve) => {
                    if (newDurations[video.id]) {
                        resolve();
                        return;
                    }

                    const videoElement = document.createElement('video');
                    videoElement.preload = 'metadata';

                    const timeout = setTimeout(() => {
                        videoElement.src = '';
                        resolve();
                    }, 10000);

                    videoElement.onloadedmetadata = () => {
                        clearTimeout(timeout);
                        if (videoElement.duration && !isNaN(videoElement.duration)) {
                            newDurations[video.id] = videoElement.duration;
                            hasChanges = true;
                        }
                        videoElement.src = '';
                        resolve();
                    };

                    videoElement.onerror = () => {
                        clearTimeout(timeout);
                        videoElement.src = '';
                        resolve();
                    };

                    videoElement.src = video.url;
                });
            });

            await Promise.all(promises);

            if (hasChanges) {
                setDurations(newDurations);
            }
            setLoading(false);
        };

        loadDurations();
    }, [videos.length]);

    return { durations, loading };
};
