import React, { useEffect, useState } from 'react';

type UpdateState =
    | { type: 'idle' }
    | { type: 'update-available'; info: any }
    | { type: 'update-not-available' }
    | { type: 'download-progress'; progress: any }
    | { type: 'downloaded'; filePath: string }
    | { type: 'error'; error: string };

declare global {
    interface Window {
        electronUpdater: {
            onUpdateState: (cb: (state: UpdateState) => void) => void;
            checkForUpdates: () => void;
            downloadUpdate: () => void;
        };
    }
}

export default function App() {
    const [updateState, setUpdateState] = useState<UpdateState>({ type: 'idle' });

    useEffect(() => {
        window.electronUpdater.onUpdateState((state) => {
            setUpdateState(state);
        });
    }, []);

    const handleCheck = () => {
        window.electronUpdater.checkForUpdates();
        setUpdateState({ type: 'idle' });
    };

    let status: React.ReactNode = null;
    let showDownloadButton = false;
    switch (updateState.type) {
        case 'idle':
            status = 'Idle';
            break;
        case 'update-available':
            status = (
                <div>
                    <div>Update available: v{updateState.info.version}</div>
                    <div>{updateState.info.releaseName}</div>
                    <div>{updateState.info.releaseNotes}</div>
                </div>
            );
            showDownloadButton = true;
            break;
        case 'update-not-available':
            status = 'No update available';
            break;
        case 'download-progress':
            status = (
                <div>
                    Downloading: {updateState.progress.percent?.toFixed(1) || '?'}%
                </div>
            );
            break;
        case 'downloaded':
            status = 'Update downloaded!';
            break;
        case 'error':
            status = <div className="text-red-400">Error: {updateState.error}</div>;
            break;
    }

    const handleDownload = () => {
        window.electronUpdater.downloadUpdate();
    };

    return (
        <div className="h-screen w-screen bg-zinc-800 flex flex-col items-center justify-center text-zinc-300">
            <div className="text-4xl mb-8">basic-electron-updater test</div>
            <button
                className="mb-6 px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xl"
                onClick={handleCheck}
            >
                Check for Updates
            </button>
            {showDownloadButton && (
                <button
                    className="mb-4 px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-xl"
                    onClick={handleDownload}
                >
                    Download Update
                </button>
            )}
            <div className="text-2xl mt-4">{status}</div>
        </div>
    );
}