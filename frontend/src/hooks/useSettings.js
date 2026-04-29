import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    darkMode: false,
    eventReminderMinutes: 30,
    eventRemindersEnabled: true,
    taskNotificationsEnabled: true,
    emailNotificationsEnabled: false,
  });

  const [loading, setLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aggieflow_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
    setLoading(false);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [settings.darkMode]);

  // Save settings to localStorage
  const updateSettings = (updates) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem('aggieflow_settings', JSON.stringify(newSettings));
  };

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const updateEventReminder = (minutes) => {
    updateSettings({ eventReminderMinutes: minutes });
  };

  const toggleEventReminders = () => {
    updateSettings({ eventRemindersEnabled: !settings.eventRemindersEnabled });
  };

  const toggleTaskNotifications = () => {
    updateSettings({ taskNotificationsEnabled: !settings.taskNotificationsEnabled });
  };

  const toggleEmailNotifications = () => {
    updateSettings({ emailNotificationsEnabled: !settings.emailNotificationsEnabled });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        toggleDarkMode,
        updateEventReminder,
        toggleEventReminders,
        toggleTaskNotifications,
        toggleEmailNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
