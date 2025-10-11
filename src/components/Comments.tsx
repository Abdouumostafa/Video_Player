'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, Reply, Edit2, Trash2, Send } from 'lucide-react';
import { initialComments } from '@/constants/data';
import { Comment } from '@/types/types';
import { formatTimestamp } from '@/utils/utiles';

const COURSE_COMMENTS = 'course_comments';

export default function Comments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem(COURSE_COMMENTS);
        if (stored) {
            const parsedComments = JSON.parse(stored);
            const commentsWithDates = parsedComments.map((c: any) => ({
                ...c,
                timestamp: new Date(c.timestamp),
                replies: c.replies.map((r: any) => ({
                    ...r,
                    timestamp: new Date(r.timestamp),
                })),
            }));
            setComments(commentsWithDates);
        } else {
            setComments(initialComments);
            localStorage.setItem(COURSE_COMMENTS, JSON.stringify(initialComments));
        }
    }, []);

    const saveComments = (updatedComments: Comment[]) => {
        setComments(updatedComments);
        localStorage.setItem(COURSE_COMMENTS, JSON.stringify(updatedComments));
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            author: 'You',
            avatar: '👤',
            text: newComment,
            timestamp: new Date(),
            likes: 0,
            replies: [],
            isLiked: false,
        };

        saveComments([comment, ...comments]);
        setNewComment('');
    };

    const handleAddReply = (commentId: string) => {
        if (!replyText.trim()) return;

        const reply: Comment = {
            id: Date.now().toString(),
            author: 'You',
            avatar: '👤',
            text: replyText,
            timestamp: new Date(),
            likes: 0,
            replies: [],
            isLiked: false,
        };

        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    replies: [...comment.replies, reply],
                };
            }
            return comment;
        });

        saveComments(updatedComments);
        setReplyText('');
        setReplyingTo(null);
    };

    const handleEditComment = (commentId: string) => {
        if (!editText.trim()) return;

        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, text: editText };
            }
            return {
                ...comment,
                replies: comment.replies.map((reply) =>
                    reply.id === commentId ? { ...reply, text: editText } : reply
                ),
            };
        });

        saveComments(updatedComments);
        setEditingId(null);
        setEditText('');
    };

    const handleDeleteComment = (commentId: string) => {
        const updatedComments = comments
            .filter((c) => c.id !== commentId)
            .map((comment) => ({
                ...comment,
                replies: comment.replies.filter((r) => r.id !== commentId),
            }));

        saveComments(updatedComments);
    };

    const handleLike = (commentId: string) => {
        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return {
                    ...comment,
                    likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                    isLiked: !comment.isLiked,
                };
            }
            return {
                ...comment,
                replies: comment.replies.map((reply) =>
                    reply.id === commentId
                        ? {
                            ...reply,
                            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                            isLiked: !reply.isLiked,
                        }
                        : reply
                ),
            };
        });

        saveComments(updatedComments);
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean; }) => (
        <div className={`${isReply ? 'ml-12' : ''}`}>
            <div className="flex gap-3">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                        {comment.avatar}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{comment.author}</span>
                                <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                            </div>
                            {comment.author === 'You' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingId(comment.id);
                                            setEditText(comment.text);
                                        }}
                                        className="text-gray-500 hover:text-blue-600"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-gray-500 hover:text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {editingId === comment.id ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                                    autoFocus
                                />
                                <button
                                    onClick={() => handleEditComment(comment.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditText('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-700">{comment.text}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                        <button
                            onClick={() => handleLike(comment.id)}
                            className={`flex items-center gap-1 text-sm ${comment.isLiked ? 'text-blue-600' : 'text-gray-500'
                                } hover:text-blue-600`}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{comment.likes > 0 ? comment.likes : ''}</span>
                        </button>
                        {!isReply && (
                            <button
                                onClick={() => setReplyingTo(comment.id)}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-600"
                            >
                                <Reply className="w-4 h-4" />
                                <span>Reply</span>
                            </button>
                        )}
                    </div>

                    {replyingTo === comment.id && (
                        <div className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                                autoFocus
                            />
                            <button
                                onClick={() => handleAddReply(comment.id)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                }}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {comment.replies.map((reply) => (
                                <CommentItem key={reply.id} comment={reply} isReply={true} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div id="comments-section" className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="w-6 h-6 text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">
                    Comments ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})
                </h2>
            </div>

            <div className="mb-6">
                <div className="flex gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-xl">
                            👤
                        </div>
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-gray-900"
                            rows={3}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Comment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}
