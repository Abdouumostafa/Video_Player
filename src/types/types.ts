export interface Video {
    id: string;
    title: string;
    url: string;
    duration?: string;
    locked?: boolean;
    isExam?: boolean;
    examQuestions?: ExamQuestion[];
}

export interface ExamQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface Topic {
    id: string;
    week: string;
    description: string;
    videos: Video[];
    hasExam?: boolean;
    examQuestions?: ExamQuestion[];
}

export interface VideoProgress {
    videoId: string;
    progress: number;
    watched: boolean;
    lastWatchedTime: number;
}

export interface Comment {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: Date;
    likes: number;
    replies: Comment[];
    isLiked?: boolean;
}

export interface ExamQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface ExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionTitle: string;
    questions: ExamQuestion[];
    onComplete: (score: number) => void;
}

export interface CourseMaterialsProps {
    instructor?: string;
    duration: string;
    lessons: number;
    enrolled: number;
    language: string;
    currentProgress: number;
}

export interface CourseTopicsWithProgressProps {
    topics: Topic[];
    videoProgress: Record<string, VideoProgress>;
    onVideoSelect: (videoId: string, videoUrl: string) => void;
    currentVideoId?: string;
    videoDurations?: Record<string, number>;
}

export interface InteractionButtonsProps {
    currentProgress: number;
    currentSection: Topic | null;
    onExamComplete: (score: number) => void;
}

export interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentProgress: number;
}

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface QuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
}

export interface VideoPlayerWithTrackingProps {
    videoUrl: string;
    videoId: string;
    onProgressUpdate: (videoId: string, progress: number, watched: boolean, duration?: number) => void;
    onVideoEnd: () => void;
    initialProgress?: number;
}

export interface Video {
    id: string;
    url: string;
    isExam?: boolean;
}