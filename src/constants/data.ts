import { Comment, Topic } from "@/types/types";

export const baseTopics: Topic[] = [
    {
        id: 'topic-1',
        week: 'Week 1-4',
        description: 'This is a first section',
        videos: [
            { id: 'video-1', title: 'Video 1', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video1.mp4', locked: false },
            { id: 'video-2', title: 'Video 2', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video2.mp4', locked: true },
            { id: 'video-3', title: 'Video 3', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video3.mp4', locked: true },
            { id: 'video-4', title: 'Video 4', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video4.mp4', locked: true },
            {
                id: 'exam-topic-1',
                title: 'Week 1-4 Exam',
                url: '',
                locked: true,
                isExam: true,
                examQuestions: [
                    {
                        id: 1,
                        question: 'Among the following status of India, which one has the oldest rock formations in the country?',
                        options: ['Asam', 'Bahar', 'Kamaltake', 'Utter Pardesh'],
                        correctAnswer: 1,
                    },
                    {
                        id: 2,
                        question: 'What is the capital of France?',
                        options: ['London', 'Berlin', 'Paris', 'Madrid'],
                        correctAnswer: 2,
                    },
                    {
                        id: 3,
                        question: 'Which planet is closest to the Sun?',
                        options: ['Venus', 'Mercury', 'Earth', 'Mars'],
                        correctAnswer: 1,
                    },
                    {
                        id: 4,
                        question: 'What is 2 + 2?',
                        options: ['3', '4', '5', '6'],
                        correctAnswer: 1,
                    },
                    {
                        id: 5,
                        question: 'What is the largest ocean?',
                        options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
                        correctAnswer: 3,
                    },
                ],
            },
        ],
    },
    {
        id: 'topic-2',
        week: 'Week 5-8',
        description: 'This is a second section',
        videos: [
            { id: 'video-5', title: 'Video 5', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video5.mp4', locked: true },
            { id: 'video-6', title: 'Video 6', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video6.mp4', locked: true },
            { id: 'video-7', title: 'Video 7', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video7.mp4', locked: true },
            {
                id: 'exam-topic-2',
                title: 'Week 5-8 Exam',
                url: '',
                locked: true,
                isExam: true,
                examQuestions: [
                    {
                        id: 1,
                        question: 'What is the main ingredient in bread?',
                        options: ['Sugar', 'Flour', 'Salt', 'Water'],
                        correctAnswer: 1,
                    },
                    {
                        id: 2,
                        question: 'How many continents are there?',
                        options: ['5', '6', '7', '8'],
                        correctAnswer: 2,
                    },
                    {
                        id: 3,
                        question: 'What is the chemical symbol for water?',
                        options: ['O2', 'H2O', 'CO2', 'NaCl'],
                        correctAnswer: 1,
                    },
                ],
            },
        ],
    },
    {
        id: 'topic-3',
        week: 'Week 9-12',
        description: 'This is a third section',
        videos: [
            { id: 'video-8', title: 'Video 8', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video8.mp4', locked: true },
            { id: 'video-9', title: 'Video 9', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video9.mp4', locked: true },
            { id: 'video-10', title: 'Video 10', url: 'https://te6dfigvturxqjqt.public.blob.vercel-storage.com/video1.mp4', locked: true },
            {
                id: 'exam-topic-3',
                title: 'Week 9-12 Exam',
                url: '',
                locked: true,
                isExam: true,
                examQuestions: [
                    {
                        id: 1,
                        question: 'What do bees collect from flowers?',
                        options: ['Water', 'Pollen', 'Leaves', 'Bark'],
                        correctAnswer: 1,
                    },
                    {
                        id: 2,
                        question: 'What is the largest land animal?',
                        options: ['Lion', 'Elephant', 'Giraffe', 'Rhino'],
                        correctAnswer: 1,
                    },
                ],
            },
        ],
    },
];

export const mockDurations = {
    'video-1': 125,
    'video-2': 180,
    'video-3': 210,
    'video-4': 165,
    'video-5': 195,
    'video-6': 220,
    'video-7': 145,
    'video-8': 190,
    'video-9': 175,
    'video-10': 200,
};

export const initialComments: Comment[] = [
    {
        id: '1',
        author: 'Sarah Johnson',
        avatar: '👩‍💼',
        text: 'Great course! The nature videos are absolutely stunning. Really enjoying the content so far.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 12,
        isLiked: false,
        replies: [],
    },
    {
        id: '2',
        author: 'Ahmed Hassan',
        avatar: '👨‍🎓',
        text: 'The exam was challenging but fair. Make sure you watch all videos carefully before attempting it!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        likes: 8,
        isLiked: false,
        replies: [],
    },
];

export
    const getMotivationalMessage = (currentProgress: number) => {
        if (currentProgress === 100) {
            return {
                emoji: '🏆',
                title: 'تمام يا بطل!',
                message: 'مبروك! خلصت الكورس كله.. أنت الأفضل بجد، حافظ على المستوى ده دايماً!',
            };
        } else if (currentProgress >= 80) {
            return {
                emoji: '💪',
                title: 'ماشي يا نجم!',
                message: `روعة! خلصت ${currentProgress}% من الكورس.. كمّل الباقي وخليك في القمة!`,
            };
        } else if (currentProgress >= 60) {
            return {
                emoji: '👍',
                title: 'عظيم يا صديقي!',
                message: `أداءك في الكورس ده أفضل من ${currentProgress}% من باقي الطلبة.. كمّل عايز أشوف اسمك في الليدر بورد هنا`,
            };
        } else if (currentProgress >= 40) {
            return {
                emoji: '📚',
                title: 'تمام كده!',
                message: `وصلت لـ ${currentProgress}% من الكورس.. استمر كده واسمك هيظهر في الليدربورد قريب!`,
            };
        } else if (currentProgress >= 20) {
            return {
                emoji: '🚀',
                title: 'ماشي الحال!',
                message: `خلصت ${currentProgress}% من الكورس.. كمّل مشاهدة وهتشوف اسمك هنا قريب!`,
            };
        } else {
            return {
                emoji: '🌟',
                title: 'بداية حلوة!',
                message: `خلصت ${currentProgress}% من الكورس.. يلا كمّل وطلّع في الليدربورد!`,
            };
        }
    };