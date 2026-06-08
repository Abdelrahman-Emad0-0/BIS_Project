import { z } from 'zod';

export const ActivitySchema = z.object({
  type: z.string(),
  message: z.string(),
  date: z.string(),
});


export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: z.string(),
  created_at: z.string(),
});

export const ReportSchema = z.object({
  id: z.number(),
  reason: z.string(),
  created_at: z.string(),
  user: z.object({
    name: z.string(),
  }),
  course: z.object({
    title: z.string(),
    teacher: z.object({
      name: z.string(),
    }),
  }),
});


export const DashboardSchema = z.object({
  total_students: z.number(),
  total_teachers: z.number(),
  total_courses: z.number(),
  total_revenue: z.number(),
  latest_users: z.array(UserSchema),
  recent_reports: z.array(ReportSchema),
  recent_activities: z.array(ActivitySchema),
});

export type DashboardData = z.infer<typeof DashboardSchema>;