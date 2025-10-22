'use client';
import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import VideoPlayerWithTracking from '@/components/VideoPlayerWithTracking';
import CourseMaterialsWithProgress from '@/components/CourseMaterialsWithProgress';
import CourseTopicsWithProgress from '@/components/CourseTopicsWithProgress';
import InteractionButtons from '@/components/InteractionButtons';

const Comments = lazy(() => import('@/components/Comments'));
const ExamModal = lazy(() => import('@/components/ExamModal'));
import { Topic, VideoProgress } from '@/types/types';
import { baseTopics } from '@/constants/data';
import styles from './page.module.css';

const VIDEO_PROGRESS = 'course_video_progress';
const CURRENT_VIDEO_KEY = 'current_video';
const EXAM_SCORES_KEY = 'exam_scores';

export default function CourseDetailsPage() {
  const [currentVideoId, setCurrentVideoId] = useState<string>('video-1');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [currentExam, setCurrentExam] = useState<any>(null);
  const [examScores, setExamScores] = useState<Record<string, number>>({});

  const getAllVideos = () => baseTopics.flatMap((topic) => topic.videos);

  const getTopicsWithLockStatus = (): Topic[] => {
    const allItems = getAllVideos();

    return baseTopics.map((topic) => ({
      ...topic,
      videos: topic.videos.map((video) => {
        if (video.id === 'video-1') return { ...video, locked: false };

        const currentItemIndex = allItems.findIndex((v) => v.id === video.id);
        if (currentItemIndex === 0) return { ...video, locked: false };

        const previousItem = allItems[currentItemIndex - 1];
        const previousProgress = videoProgress[previousItem.id];
        const isUnlocked = previousProgress?.watched || false;

        return { ...video, locked: !isUnlocked };
      }),
    }));
  };

  const topics = getTopicsWithLockStatus();

  const findLastWatchedVideo = (progress: Record<string, VideoProgress>) => {
    const allItems = getAllVideos();

    const itemsWithProgress = allItems
      .filter(item => progress[item.id])
      .map(item => ({
        ...item,
        progress: progress[item.id],
      }))
      .sort((a, b) => b.progress.lastWatchedTime - a.progress.lastWatchedTime);

    if (itemsWithProgress.length === 0) {
      return allItems[0];
    }

    const lastWatched = itemsWithProgress[0];

    if (lastWatched.progress.watched) {
      const lastWatchedIndex = allItems.findIndex(v => v.id === lastWatched.id);
      if (lastWatchedIndex < allItems.length - 1) {
        const nextItem = allItems[lastWatchedIndex + 1];
        if (nextItem) return nextItem;
      }
    }

    return lastWatched;
  };

  useEffect(() => {
    const stored = localStorage.getItem(VIDEO_PROGRESS);
    const storedScores = localStorage.getItem(EXAM_SCORES_KEY);



    if (storedScores) {
      setExamScores(JSON.parse(storedScores));
    }

    if (stored) {
      const loadedProgress = JSON.parse(stored);
      setVideoProgress(loadedProgress);

      const lastItem = findLastWatchedVideo(loadedProgress);
      setCurrentVideoId(lastItem.id);
      setCurrentVideoUrl(lastItem.url);

    } else {
      setCurrentVideoUrl(baseTopics[0].videos[0].url);
    }

    setIsLoaded(true);

  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CURRENT_VIDEO_KEY, currentVideoId);
    }
  }, [currentVideoId, isLoaded]);

  useEffect(() => {
    if (Object.keys(videoProgress).length > 0) {
      localStorage.setItem(VIDEO_PROGRESS, JSON.stringify(videoProgress));
    }
  }, [videoProgress]);

  const handleProgressUpdate = useCallback((videoId: string, progress: number, watched: boolean) => {
    setVideoProgress((prev) => ({
      ...prev,
      [videoId]: {
        videoId,
        progress,
        watched,
        lastWatchedTime: Date.now(),
      },
    }));
  }, []);


  const handleVideoEnd = useCallback(() => {
    setVideoProgress((prev) => ({
      ...prev,
      [currentVideoId]: {
        videoId: currentVideoId,
        progress: 100,
        watched: true,
        lastWatchedTime: Date.now(),
      },
    }));

    setTimeout(() => {
      const allItems = getAllVideos();
      const currentIndex = allItems.findIndex((v) => v.id === currentVideoId);

      if (currentIndex < allItems.length - 1) {
        const nextItem = allItems[currentIndex + 1];
        setCurrentVideoId(nextItem.id);
        setCurrentVideoUrl(nextItem.url);

        if (nextItem.isExam) {
          setCurrentExam(nextItem);
          setShowExam(true);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('🎉 Congratulations! Course completed!');
      }
    }, 1500);
  }, [currentVideoId]);

  const handleVideoSelect = (videoId: string, videoUrl: string) => {
    const allItems = topics.flatMap((topic) => topic.videos);
    const selectedItem = allItems.find((v) => v.id === videoId);

    if (selectedItem?.locked) {
      alert('⚠️ Please complete the previous items first!');
      return;
    }

    setCurrentVideoId(videoId);

    if (selectedItem?.isExam) {
      setCurrentExam(selectedItem);
      setShowExam(true);
    } else {
      setCurrentVideoUrl(videoUrl);
    }
  };

  const handleExamComplete = (score: number) => {
    if (currentExam) {
      setVideoProgress(prev => ({
        ...prev,
        [currentExam.id]: {
          videoId: currentExam.id,
          progress: 100,
          watched: true,
          lastWatchedTime: Date.now(),
        },
      }));

      const newScores = {
        ...examScores,
        [currentExam.id]: score,
      };
      setExamScores(newScores);
      localStorage.setItem(EXAM_SCORES_KEY, JSON.stringify(newScores));
    }
  };

  const handleExamClose = () => {
    setShowExam(false);

    if (currentExam) {
      const allItems = getAllVideos();
      const currentIndex = allItems.findIndex((v) => v.id === currentExam.id);

      if (currentIndex < allItems.length - 1) {
        const nextItem = allItems[currentIndex + 1];
        setCurrentVideoId(nextItem.id);

        if (nextItem.isExam) {
          setCurrentVideoUrl('');
        } else {
          setCurrentVideoUrl(nextItem.url);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('🎉 Congratulations! Course completed!');
      }
    }
  };

  const allVideosData = getAllVideos();
  const watchedCount = allVideosData.filter((v) => videoProgress[v.id]?.watched).length;
  const overallProgress = Math.round((watchedCount / allVideosData.length) * 100);

  const currentItem = getAllVideos().find(v => v.id === currentVideoId);
  const getCurrentSection = useCallback(() => {
    return baseTopics.find(topic =>
      topic.videos.some(v => v.id === currentVideoId)
    ) || null;
  }, [currentVideoId]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>Home</span>
          <span>›</span>
          <span>Courses</span>
          <span>›</span>
          <span className="text-gray-900">Course Details</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Exploring Beautiful Nature
        </h1>

        <div className={`${styles.contentGrid} hidden lg:grid`}>
          <div className={`${styles.videoContainer} space-y-8`}>
            {!currentItem?.isExam ? (
              <VideoPlayerWithTracking
                key={currentVideoId}
                videoUrl={currentVideoUrl}
                videoId={currentVideoId}
                onProgressUpdate={handleProgressUpdate}
                onVideoEnd={handleVideoEnd}
                initialProgress={videoProgress[currentVideoId]?.progress || 0}
                isPriority={currentVideoId === 'video-1'}
              />

            ) : (
              <div className="bg-blue-100 rounded-lg p-12 text-center">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  📝 {currentItem.title}
                </h2>
                <p className="text-blue-700 mb-6">
                  Click below to start the exam
                </p>
                <button
                  onClick={() => {
                    setCurrentExam(currentItem);
                    setShowExam(true);
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Start Exam
                </button>
              </div>
            )}

            <InteractionButtons
              currentProgress={overallProgress}
              currentSection={getCurrentSection()}
              onExamComplete={handleExamComplete}
            />
            <div className="lg:col-span-1">
              <CourseMaterialsWithProgress
                instructor="Ali Shahin"
                duration="3 weeks"
                lessons={allVideosData.length}
                enrolled={65}
                language="English"
                currentProgress={overallProgress}
              />
            </div>
            <Suspense fallback={
              <div className="bg-white rounded-lg p-6 h-64 animate-pulse" />
            }>
              <Comments />
            </Suspense>
          </div>

          <div className="lg:col-span-1">
            <CourseTopicsWithProgress
              topics={topics}
              videoProgress={videoProgress}
              onVideoSelect={handleVideoSelect}
              currentVideoId={currentVideoId}
            />
          </div>
        </div>

        <div className="lg:hidden space-y-6">
          {!currentItem?.isExam ? (
            <VideoPlayerWithTracking
              key={currentVideoId}
              videoUrl={currentVideoUrl}
              videoId={currentVideoId}
              onProgressUpdate={handleProgressUpdate}
              onVideoEnd={handleVideoEnd}
              initialProgress={videoProgress[currentVideoId]?.progress || 0}
            />
          ) : (
            <div className="bg-blue-100 rounded-lg p-8 text-center">
              <h2 className="text-xl font-bold text-blue-900 mb-3">
                📝 {currentItem.title}
              </h2>
              <p className="text-blue-700 mb-4">
                Click below to start the exam
              </p>
              <button
                onClick={() => {
                  setCurrentExam(currentItem);
                  setShowExam(true);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold"
              >
                Start Exam
              </button>
            </div>
          )}
          <InteractionButtons
            currentProgress={overallProgress}
            currentSection={getCurrentSection()}
            onExamComplete={handleExamComplete}
          />
          <CourseMaterialsWithProgress
            instructor="Nature Explorer"
            duration="3 weeks"
            lessons={10}
            enrolled={65}
            language="English"
            currentProgress={overallProgress}
          />
          <CourseTopicsWithProgress
            topics={topics}
            videoProgress={videoProgress}
            onVideoSelect={handleVideoSelect}
            currentVideoId={currentVideoId}
          />
          <Comments />
        </div>
      </div>

      <Suspense fallback={null}>
        {showExam && (
          <ExamModal
            isOpen={showExam}
            onClose={handleExamClose}
            sectionTitle={currentExam?.title || ''}
            questions={currentExam?.examQuestions || []}
            onComplete={handleExamComplete}
          />
        )}
      </Suspense>
    </div>
  );
}
