import { create } from 'zustand';

const useStore = create((set) => ({
  sensorData: [],
  trafficData: [],
  complaints: [],
  alerts: [],
  environment: {},
  setSensorData: (data) => set({ sensorData: data }),
  addSensorReading: (reading) => set((state) => ({ 
    sensorData: [...state.sensorData.slice(-9), reading] 
  })),
  setTrafficData: (data) => set({ trafficData: data }),
  addTrafficReading: (reading) => set((state) => ({ 
    trafficData: [...state.trafficData.slice(-4), reading] 
  })),
  setComplaints: (complaints) => set({ complaints }),
  addAlert: (alertStr) => set((state) => ({
    alerts: [alertStr, ...state.alerts].slice(0, 5) // keep last 5
  })),
  setEnvironment: (data) => set({ environment: data }),
  
  // Auth State
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,
  login: (token, user) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user });
  },
  logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null });
  }
}));

export default useStore;
