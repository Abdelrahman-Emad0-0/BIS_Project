export interface Activity {
  type: string;
  message: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  role: string;
  status: string;
  created_at: string;
}

export interface Report {
  id: number;
  reason: string; 
  created_at: string;
  user: {
    name: string;
  };
  course: {
    title: string;
    teacher: {
      name: string;
    };
  };
}

export interface DashboardData {
  total_students: number;
  total_teachers: number;
  total_courses: number;
  total_revenue: number;
  latest_users: User[];
  recent_activities: Activity[];
  recent_reports: Report[]; 
}