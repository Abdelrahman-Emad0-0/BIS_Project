import { api } from "@/lib/api";


export const createSection = (courseId: number, title: string) => 
  api.post(`/courses/${courseId}/sections`, { title });


export const createLesson = (sectionId: number, lessonData: any) => 
  api.post(`/sections/${sectionId}/lessons`, lessonData);