"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Moon, 
    Sun, 
    Bell, 
    BellOff, 
    Lock, 
    Trash2, 
    BookOpen,
    Zap,
    Volume2,
    VolumeX,
    Check,
    Loader2,
    ChevronRight,
    Shield,
    Palette,
    GraduationCap,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Settings storage keys
const SETTINGS_KEY = 'studybuddy_settings';

interface Settings {
    theme: 'dark' | 'light' | 'system';
    notifications: boolean;
    soundEffects: boolean;
    autoSave: boolean;
    defaultQuizSize: number;
    defaultFlashcardSize: number;
    showConfidence: boolean;
    compactMode: boolean;
}

const defaultSettings: Settings = {
    theme: 'dark',
    notifications: true,
    soundEffects: true,
    autoSave: true,
    defaultQuizSize: 5,
    defaultFlashcardSize: 10,
    showConfidence: true,
    compactMode: false,
};

function SettingsPageContent() {
    const { user, token, logout } = useAuth();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
    }, []);

    // Save settings to localStorage
    const saveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        showSuccess('Settings saved!');
    };

    const showSuccess = (message: string) => {
        setSuccess(message);
        setTimeout(() => setSuccess(''), 3000);
    };

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => setError(''), 5000);
    };

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            showError('New passwords do not match');
            return;
        }
        if (passwords.new.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    current_password: passwords.current,
                    new_password: passwords.new,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || 'Failed to change password');
            }

            showSuccess('Password changed successfully!');
            setShowPasswordModal(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to delete account');
            }

            logout();
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Failed to delete account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearData = () => {
        localStorage.removeItem(SETTINGS_KEY);
        setSettings(defaultSettings);
        showSuccess('All local data cleared!');
    };

    const SettingSection = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-4"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </motion.div>
    );

    const ToggleSetting = ({ label, description, value, onChange, icon: Icon }: { 
        label: string; 
        description?: string; 
        value: boolean; 
        onChange: (value: boolean) => void;
        icon?: React.ElementType;
    }) => (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="w-5 h-5 text-slate-400" />}
                <div>
                    <p className="text-white font-medium">{label}</p>
                    {description && <p className="text-slate-400 text-sm">{description}</p>}
                </div>
            </div>
            <button
                onClick={() => onChange(!value)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                    value ? 'bg-blue-600' : 'bg-slate-700'
                }`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        value ? 'left-7' : 'left-1'
                    }`}
                />
            </button>
        </div>
    );

    const SelectSetting = ({ label, description, value, options, onChange }: {
        label: string;
        description?: string;
        value: number;
        options: { value: number; label: string }[];
        onChange: (value: number) => void;
    }) => (
        <div className="flex items-center justify-between py-2">
            <div>
                <p className="text-white font-medium">{label}</p>
                {description && <p className="text-slate-400 text-sm">{description}</p>}
            </div>
            <select
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/app">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Settings</h1>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        {success}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Appearance Settings */}
                <SettingSection title="Appearance" icon={Palette}>
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                            {settings.theme === 'dark' ? (
                                <Moon className="w-5 h-5 text-slate-400" />
                            ) : (
                                <Sun className="w-5 h-5 text-slate-400" />
                            )}
                            <div>
                                <p className="text-white font-medium">Theme</p>
                                <p className="text-slate-400 text-sm">Choose your preferred theme</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {(['dark', 'light', 'system'] as const).map((theme) => (
                                <button
                                    key={theme}
                                    onClick={() => saveSettings({ ...settings, theme })}
                                    className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                                        settings.theme === theme
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ToggleSetting
                        label="Compact Mode"
                        description="Use smaller UI elements"
                        value={settings.compactMode}
                        onChange={(v) => saveSettings({ ...settings, compactMode: v })}
                    />
                </SettingSection>

                {/* Notifications Settings */}
                <SettingSection title="Notifications" icon={Bell}>
                    <ToggleSetting
                        label="Enable Notifications"
                        description="Get notified about study reminders"
                        value={settings.notifications}
                        onChange={(v) => saveSettings({ ...settings, notifications: v })}
                        icon={settings.notifications ? Bell : BellOff}
                    />
                    <ToggleSetting
                        label="Sound Effects"
                        description="Play sounds for quiz answers"
                        value={settings.soundEffects}
                        onChange={(v) => saveSettings({ ...settings, soundEffects: v })}
                        icon={settings.soundEffects ? Volume2 : VolumeX}
                    />
                </SettingSection>

                {/* Study Preferences */}
                <SettingSection title="Study Preferences" icon={GraduationCap}>
                    <SelectSetting
                        label="Default Quiz Size"
                        description="Number of questions per quiz"
                        value={settings.defaultQuizSize}
                        options={[
                            { value: 3, label: '3 questions' },
                            { value: 5, label: '5 questions' },
                            { value: 10, label: '10 questions' },
                            { value: 15, label: '15 questions' },
                            { value: 20, label: '20 questions' },
                        ]}
                        onChange={(v) => saveSettings({ ...settings, defaultQuizSize: v })}
                    />
                    <SelectSetting
                        label="Default Flashcard Size"
                        description="Number of flashcards per set"
                        value={settings.defaultFlashcardSize}
                        options={[
                            { value: 5, label: '5 cards' },
                            { value: 10, label: '10 cards' },
                            { value: 15, label: '15 cards' },
                            { value: 20, label: '20 cards' },
                            { value: 25, label: '25 cards' },
                        ]}
                        onChange={(v) => saveSettings({ ...settings, defaultFlashcardSize: v })}
                    />
                    <ToggleSetting
                        label="Show Confidence Score"
                        description="Display AI confidence in answers"
                        value={settings.showConfidence}
                        onChange={(v) => saveSettings({ ...settings, showConfidence: v })}
                        icon={Zap}
                    />
                    <ToggleSetting
                        label="Auto-save Progress"
                        description="Automatically save study progress"
                        value={settings.autoSave}
                        onChange={(v) => saveSettings({ ...settings, autoSave: v })}
                        icon={BookOpen}
                    />
                </SettingSection>

                {/* Security Settings */}
                <SettingSection title="Security" icon={Shield}>
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center justify-between w-full py-3 text-left hover:bg-slate-800/50 rounded-lg px-3 -mx-3 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-white font-medium">Change Password</p>
                                <p className="text-slate-400 text-sm">Update your account password</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                </SettingSection>

                {/* Danger Zone */}
                <SettingSection title="Danger Zone" icon={AlertTriangle}>
                    <button
                        onClick={handleClearData}
                        className="flex items-center justify-between w-full py-3 text-left hover:bg-slate-800/50 rounded-lg px-3 -mx-3 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-orange-400" />
                            <div>
                                <p className="text-white font-medium">Clear Local Data</p>
                                <p className="text-slate-400 text-sm">Reset all settings to default</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center justify-between w-full py-3 text-left hover:bg-red-900/20 rounded-lg px-3 -mx-3 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-5 h-5 text-red-400" />
                            <div>
                                <p className="text-red-400 font-medium">Delete Account</p>
                                <p className="text-slate-400 text-sm">Permanently delete your account and data</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </button>
                </SettingSection>

                {/* Account Info */}
                <div className="text-center text-slate-500 text-sm mt-8">
                    <p>Logged in as <span className="text-slate-300">{user?.email}</span></p>
                    <p className="mt-1">Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswords({ current: '', new: '', confirm: '' });
                                }}
                                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleChangePassword}
                                disabled={isLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-500"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Change Password'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Delete Account Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-red-900/50 rounded-2xl p-6 w-full max-w-md"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Delete Account</h2>
                                <p className="text-slate-400 text-sm">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete your account? All your documents, study materials, and data will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteAccount}
                                disabled={isLoading}
                                className="flex-1 bg-red-600 hover:bg-red-500"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Account'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    );
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsPageContent />
        </ProtectedRoute>
    );
}
