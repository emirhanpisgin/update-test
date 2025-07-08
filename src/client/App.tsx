import React, { useEffect, useState } from 'react';

type LogEntry = {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
    details?: any;
};

type UpdateState =
    | { type: 'idle' }
    | { type: 'checking' }
    | { type: 'update-available'; info: any }
    | { type: 'update-not-available' }
    | { type: 'downloading'; progress: any }
    | { type: 'downloaded'; filePath: string }
    | { type: 'installing' }
    | { type: 'error'; error: string };

declare global {
    interface Window {
        electronUpdater: {
            onUpdateState: (cb: (state: UpdateState) => void) => void;
            onLog: (cb: (log: LogEntry) => void) => void;
            checkForUpdates: () => void;
            downloadUpdate: () => void;
            installUpdate: () => void;
            getAppVersion: () => Promise<string>;
        };
    }
}

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
};

const addLog = (
    logs: LogEntry[], 
    setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>, 
    level: LogEntry['level'], 
    message: string, 
    details?: any
): void => {
    const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: formatTime(new Date()),
        level,
        message,
        details
    };
    setLogs(prev => [...prev, newLog].slice(-100)); // Keep last 100 logs
};

export default function App() {
    const [updateState, setUpdateState] = useState<UpdateState>({ type: 'idle' });
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [appVersion, setAppVersion] = useState<string>('Unknown');
    const [showLogs, setShowLogs] = useState<boolean>(true);
    const [autoCheck, setAutoCheck] = useState<boolean>(false);

    useEffect(() => {
        // Get app version
        window.electronUpdater.getAppVersion().then(setAppVersion);

        // Add initial log
        addLog(logs, setLogs, 'info', 'Application started');

        // Set up update state listener
        window.electronUpdater.onUpdateState((state) => {
            setUpdateState(state);
            
            switch (state.type) {
                case 'checking':
                    addLog(logs, setLogs, 'info', 'Checking for updates...');
                    break;
                case 'update-available':
                    addLog(logs, setLogs, 'success', `Update available: v${state.info.version}`, state.info);
                    break;
                case 'update-not-available':
                    addLog(logs, setLogs, 'info', 'No updates available');
                    break;
                case 'downloading':
                    if (state.progress.percent !== undefined) {
                        addLog(logs, setLogs, 'info', `Downloading: ${state.progress.percent.toFixed(1)}%`, state.progress);
                    }
                    break;
                case 'downloaded':
                    addLog(logs, setLogs, 'success', 'Update downloaded successfully', { filePath: state.filePath });
                    break;
                case 'installing':
                    addLog(logs, setLogs, 'info', 'Installing update...');
                    break;
                case 'error':
                    addLog(logs, setLogs, 'error', `Update error: ${state.error}`, { error: state.error });
                    break;
            }
        });

        // Set up log listener
        window.electronUpdater.onLog((log) => {
            setLogs(prev => [...prev, log].slice(-100));
        });

        // Auto-check functionality
        let interval: NodeJS.Timeout | null = null;
        if (autoCheck) {
            interval = setInterval(() => {
                addLog(logs, setLogs, 'info', 'Auto-checking for updates...');
                window.electronUpdater.checkForUpdates();
            }, 30000); // Check every 30 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoCheck]);

    const handleCheck = (): void => {
        addLog(logs, setLogs, 'info', 'Manual update check initiated');
        window.electronUpdater.checkForUpdates();
    };

    const handleDownload = (): void => {
        addLog(logs, setLogs, 'info', 'Starting download...');
        window.electronUpdater.downloadUpdate();
    };

    const handleInstall = (): void => {
        addLog(logs, setLogs, 'info', 'Installing update and restarting...');
        window.electronUpdater.installUpdate();
    };

    const clearLogs = (): void => {
        setLogs([]);
        addLog([], setLogs, 'info', 'Logs cleared');
    };

    const getStatusColor = (state: UpdateState): string => {
        switch (state.type) {
            case 'idle': return 'text-gray-400';
            case 'checking': return 'text-blue-400 animate-pulse';
            case 'update-available': return 'text-green-400';
            case 'update-not-available': return 'text-gray-400';
            case 'downloading': return 'text-blue-400 animate-pulse';
            case 'downloaded': return 'text-green-400';
            case 'installing': return 'text-yellow-400 animate-pulse';
            case 'error': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getLogColor = (level: LogEntry['level']): string => {
        switch (level) {
            case 'info': return 'text-blue-300';
            case 'warn': return 'text-yellow-300';
            case 'error': return 'text-red-300';
            case 'success': return 'text-green-300';
            default: return 'text-gray-300';
        }
    };

    const getStatusMessage = (state: UpdateState): React.ReactNode => {
        switch (state.type) {
            case 'idle':
                return 'Ready to check for updates';
            case 'checking':
                return 'Checking for updates...';
            case 'update-available':
                return (
                    <div className="space-y-2">
                        <div className="font-semibold">Update Available: v{state.info.version}</div>
                        {state.info.releaseName && (
                            <div className="text-sm text-gray-300">{state.info.releaseName}</div>
                        )}
                        {state.info.releaseNotes && (
                            <div className="text-xs text-gray-400 max-w-md truncate">
                                {state.info.releaseNotes}
                            </div>
                        )}
                    </div>
                );
            case 'update-not-available':
                return 'You have the latest version';
            case 'downloading':
                return (
                    <div className="space-y-2">
                        <div>Downloading update...</div>
                        {state.progress.percent !== undefined && (
                            <div className="w-64 bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${state.progress.percent}%` }}
                                />
                            </div>
                        )}
                        <div className="text-sm text-gray-400">
                            {state.progress.transferred && state.progress.total ? 
                                `${(state.progress.transferred / 1024 / 1024).toFixed(1)} MB / ${(state.progress.total / 1024 / 1024).toFixed(1)} MB` :
                                'Preparing download...'
                            }
                        </div>
                    </div>
                );
            case 'downloaded':
                return 'Update ready to install!';
            case 'installing':
                return 'Installing update and restarting...';
            case 'error':
                return (
                    <div className="space-y-1">
                        <div>Update failed</div>
                        <div className="text-sm text-red-300">{state.error}</div>
                    </div>
                );
            default:
                return 'Unknown state';
        }
    };

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">basic-electron-updater</h1>
                        <p className="text-gray-400">Test Application v{appVersion} - Enhanced UI ✨</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={autoCheck}
                                onChange={(e) => setAutoCheck(e.target.checked)}
                                className="rounded"
                            />
                            <span>Auto-check (30s)</span>
                        </label>
                        <button
                            onClick={() => setShowLogs(!showLogs)}
                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                        >
                            {showLogs ? 'Hide' : 'Show'} Logs
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    {/* Status Display */}
                    <div className={`text-center mb-8 ${getStatusColor(updateState)}`}>
                        <div className="text-lg mb-4">
                            {getStatusMessage(updateState)}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleCheck}
                            disabled={updateState.type === 'checking' || updateState.type === 'downloading'}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                        >
                            Check for Updates
                        </button>

                        {updateState.type === 'update-available' && (
                            <button
                                onClick={handleDownload}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
                            >
                                Download Update
                            </button>
                        )}

                        {updateState.type === 'downloaded' && (
                            <button
                                onClick={handleInstall}
                                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-medium transition-colors"
                            >
                                Install & Restart
                            </button>
                        )}
                    </div>
                </div>

                {/* Logs Panel */}
                {showLogs && (
                    <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="font-semibold">Update Logs</h3>
                            <button
                                onClick={clearLogs}
                                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
                            >
                                Clear
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                            {logs.map((log) => (
                                <div key={log.id} className="border-l-2 border-gray-700 pl-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500">{log.timestamp}</span>
                                        <span className={`font-semibold ${getLogColor(log.level)}`}>
                                            [{log.level.toUpperCase()}]
                                        </span>
                                    </div>
                                    <div className="text-gray-300 mt-1">{log.message}</div>
                                    {log.details && (
                                        <details className="mt-1 text-gray-500">
                                            <summary className="cursor-pointer text-xs">Details</summary>
                                            <pre className="mt-1 text-xs overflow-x-auto">
                                                {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-gray-500 text-center">No logs yet</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}