import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export type UserData = {
  age: string;
  focus: string;
  mood: string;
  goal: string;
};

export type AuraReading = {
  color: string;
  title: string;
  description: string;
  resonance: number;
  evolution_state?: string;
  face_reading?: string;
  faceData?: {
    stress: number;
    energy: number;
    balance: number;
    openness: number;
  };
  scenarios: {
    current: string;
    optimized: string;
    risk: string;
  };
};

type AuraContextType = {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  result: AuraReading | null;
  setResult: (result: AuraReading) => void;
  history: AuraReading[];
  clearHistory: () => void;
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'success') => void;
  capturedImageBase64: string | null;
  setCapturedImageBase64: (b64: string | null) => void;
};

const AuraContext = createContext<AuraContextType | undefined>(undefined);

export const AuraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [result, setResultState] = useState<AuraReading | null>(null);
  const [history, setHistory] = useState<AuraReading[]>([]);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const saved = await AsyncStorage.getItem('aura_history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (e) { console.error(e); }
  };

  const setResult = async (newResult: AuraReading) => {
    setResultState(newResult);
    const newHistory = [newResult, ...history].slice(0, 20);
    setHistory(newHistory);
    try {
      await AsyncStorage.setItem('aura_history', JSON.stringify(newHistory));
    } catch (e) { console.error(e); }
  };

  const clearHistory = async () => {
    setHistory([]);
    await AsyncStorage.removeItem('aura_history');
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' = 'light') => {
    switch (type) {
      case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
      case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
      case 'heavy': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
      case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
    }
  };

  return (
    <AuraContext.Provider value={{
      userData,
      setUserData,
      result,
      setResult,
      history,
      clearHistory,
      triggerHaptic,
      capturedImageBase64,
      setCapturedImageBase64,
    }}>
      {children}
    </AuraContext.Provider>
  );
};

export const useAuraContext = () => {
  const context = useContext(AuraContext);
  if (!context) throw new Error('useAuraContext must be used within AuraProvider');
  return context;
};
