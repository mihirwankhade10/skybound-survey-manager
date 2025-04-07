import axios from 'axios';

// Create an axios instance with base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData: { name: string; email: string; password: string; role?: string }) => 
    API.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) => 
    API.post('/auth/login', credentials),
  
  getCurrentUser: () => 
    API.get('/auth/me'),
};

// Drones API calls
export const dronesAPI = {
  getAllDrones: () => 
    API.get('/drones'),
  
  getDroneById: (id: string) => 
    API.get(`/drones/${id}`),
  
  addDrone: (droneData: any) => 
    API.post('/drones', droneData),
  
  updateDrone: (id: string, droneData: any) => 
    API.put(`/drones/${id}`, droneData),
  
  deleteDrone: (id: string) => 
    API.delete(`/drones/${id}`),
    
  getAvailableDrones: () =>
    API.get('/drones/available'),
};

// Mission data types
export interface MissionFormData {
  name: string;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  startTime: string;
  recurrenceType: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
  flightPath: {
    type: string;
    coordinates: number[];
  }[];
  flightAltitude: number;
  patternType: 'Grid' | 'Crosshatch' | 'Perimeter';
  sensorType: 'RGB' | 'Thermal' | 'Multispectral' | 'LiDAR';
  status?: 'Scheduled' | 'In Progress' | 'Completed' | 'Aborted';
  assignedDroneId?: string | null;
}

// Missions API calls
export const missionsAPI = {
  getAllMissions: () => 
    API.get('/missions'),
  
  getMissionById: (id: string) => 
    API.get(`/missions/${id}`),
  
  addMission: (missionData: MissionFormData) => 
    API.post('/missions', missionData),
  
  updateMission: (id: string, missionData: Partial<MissionFormData>) => 
    API.put(`/missions/${id}`, missionData),
  
  deleteMission: (id: string) => 
    API.delete(`/missions/${id}`),
    
  getAvailableDrones: () =>
    API.get('/drones/available'),
};

// Mission Monitoring API calls
export const monitorAPI = {
  getLiveMissionData: (missionId: string) => 
    API.get(`/monitor/${missionId}`),
  
  getDroneTelemetry: (droneId: string) => 
    API.get(`/monitor/drone/${droneId}/telemetry`),
};

// Survey Reports API calls
export const reportsAPI = {
  getAllReports: () => 
    API.get('/reports'),
  
  getReportById: (id: string) => 
    API.get(`/reports/${id}`),
  
  generateReport: (missionId: string) => 
    API.post(`/reports/generate/${missionId}`),
  
  downloadReport: (reportId: string) => 
    API.get(`/reports/${reportId}/download`, { responseType: 'blob' }),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => 
    API.get('/dashboard/stats'),
  
  getRecentMissions: () => 
    API.get('/dashboard/recent'),
  
  getMonthlyActivity: () => 
    API.get('/dashboard/monthly-activity'),
};

export default API;
