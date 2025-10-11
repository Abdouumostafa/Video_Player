'use client';

import React from 'react';
import { Clock, BookOpen, Users, Globe, User } from 'lucide-react';
import { CourseMaterialsProps } from '@/types/types';



export default function CourseMaterialsWithProgress({
    instructor = 'Edward Norton',
    duration,
    lessons,
    enrolled,
    language,
}: CourseMaterialsProps) {
    return (
        <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Course Materials</h2>

            <div className="grid md:grid-cols-2 gap-6 pt-4">
                <MaterialItem icon={User} label="Instructor:" value={instructor} />
                <MaterialItem icon={Clock} label="Duration:" value={duration} />
                <MaterialItem icon={BookOpen} label="Lessons:" value={lessons.toString()} />
                <MaterialItem icon={Users} label="Enrolled:" value={`${enrolled} students`} />
                <MaterialItem icon={Globe} label="Language:" value={language} />
            </div>
        </div>
    );
}

function MaterialItem({ icon: Icon, label, value }: { icon: any; label: string; value: string; }) {
    return (
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
            <div className="flex items-center gap-2">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium text-gray-900">{value}</span>
            </div>
        </div>
    );
}
