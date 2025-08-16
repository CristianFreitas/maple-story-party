'use client';

import React, { useState } from 'react';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useProfileSync } from '@/hooks/useProfileSync';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Upload, Download, Smartphone, Clock, Copy, Check, AlertCircle } from 'lucide-react';

interface ProfileSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSyncModal({ isOpen, onClose }: ProfileSyncModalProps) {
  const { profile, createProfile } = usePlayerSession();
  const { 
    isSyncing, 
    syncError, 
    lastSyncTime,
    syncProfileToCloud, 
    syncProfileFromCloud,
    getSyncHistory 
  } = useProfileSync();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'upload' | 'download' | 'history'>('upload');
  const [syncCode, setSyncCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [downloadCode, setDownloadCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleUpload = async () => {
    if (!profile) return;

    try {
      const code = await syncProfileToCloud(profile);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const handleDownload = async () => {
    if (!downloadCode.trim()) return;

    try {
      const downloadedProfile = await syncProfileFromCloud(downloadCode.toUpperCase());
      
      // Replace current profile with downloaded one
      createProfile({
        name: downloadedProfile.name,
        level: downloadedProfile.level,
        job: downloadedProfile.job,
        server: downloadedProfile.server,
        favoriteClasses: downloadedProfile.favoriteClasses,
        preferredDifficulty: downloadedProfile.preferredDifficulty
      });

      alert('Profile synced successfully! 🎉');
      onClose();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isOpen) return null;

  const syncHistory = profile ? getSyncHistory(profile.id) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="maple-panel max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-maple-blue" />
              <h2 className="text-xl font-display font-bold text-maple-dark">
                Profile Sync
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upload' 
                  ? 'bg-white text-maple-blue shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-1" />
              Backup
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'download' 
                  ? 'bg-white text-maple-blue shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Download className="w-4 h-4 inline mr-1" />
              Restore
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'history' 
                  ? 'bg-white text-maple-blue shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-1" />
              History
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">📱 Backup Your Profile</h3>
                <p className="text-sm text-blue-600 mb-4">
                  Create a sync code to access your profile on other devices. The code expires in 24 hours.
                </p>
                
                {!generatedCode ? (
                  <button
                    onClick={handleUpload}
                    disabled={!profile || isSyncing}
                    className="maple-button w-full py-2 disabled:opacity-50"
                  >
                    {isSyncing ? 'Creating...' : 'Create Sync Code'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-white border-2 border-dashed border-maple-blue rounded-lg p-4 text-center">
                      <div className="text-2xl font-mono font-bold text-maple-blue mb-2">
                        {generatedCode}
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedCode)}
                        className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-600 hover:text-gray-800"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      Share this code with your other devices. It expires in 24 hours.
                    </div>
                  </div>
                )}
              </div>

              {lastSyncTime && (
                <div className="text-xs text-gray-500 text-center">
                  Last backup: {formatTime(lastSyncTime)}
                </div>
              )}
            </div>
          )}

          {/* Download Tab */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">📥 Restore Your Profile</h3>
                <p className="text-sm text-green-600 mb-4">
                  Enter the sync code from your other device to restore your profile.
                </p>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={downloadCode}
                    onChange={(e) => setDownloadCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-digit sync code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-blue focus:border-transparent text-center font-mono text-lg"
                    maxLength={6}
                  />
                  
                  <button
                    onClick={handleDownload}
                    disabled={downloadCode.length !== 6 || isSyncing}
                    className="maple-button w-full py-2 disabled:opacity-50"
                  >
                    {isSyncing ? 'Restoring...' : 'Restore Profile'}
                  </button>
                </div>

                {profile && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-xs text-yellow-700">
                        <strong>Warning:</strong> This will replace your current profile data.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-2">📝 Sync History</h3>
                
                {syncHistory.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">
                    No sync history available
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {syncHistory.map((entry: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded p-3 text-sm">
                        <div>
                          <div className="font-mono font-medium">{entry.code}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(entry.timestamp)}
                          </div>
                        </div>
                        <button
                          onClick={() => copyToClipboard(entry.code)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {syncError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{syncError}</p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="bg-maple-light rounded-lg p-4">
              <h4 className="font-medium text-maple-dark mb-2">🔒 Privacy & Security</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Sync codes expire automatically after 24 hours</li>
                <li>• Only your profile data is synced (no passwords)</li>
                <li>• Data is stored locally in your browser</li>
                <li>• No personal information is shared</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
