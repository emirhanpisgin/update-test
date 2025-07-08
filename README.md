# Update Test App

This is a test application for the `basic-electron-updater` package. It demonstrates how to integrate the auto-updater into an Electron Forge application.

## Features

- **Electron Forge**: Modern Electron development setup
- **React**: UI framework for the renderer process
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Auto-updater**: Integrated with basic-electron-updater
- **Enhanced UI**: Real-time logging, progress tracking, and status display
- **Manual Controls**: User-initiated update checks and downloads
- **Auto-check Mode**: Optional automatic update checking every 30 seconds
- **Detailed Logging**: Comprehensive logging with timestamps and log levels
- **Professional Interface**: Modern gradient UI with responsive design

## Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup
```bash
npm install
```

### Development Mode
```bash
npm start
```

### Building
```bash
npm run make
```

### Publishing
```bash
npm run publish
```

## Auto-updater Configuration

The app is configured to check for updates from the GitHub repository `emirhanpisgin/update-test`. The updater configuration can be found in `src/index.ts`:

```typescript
const updater = new Updater({
    repo: "emirhanpisgin/update-test",
    autoDownload: false, // Manual control for better UX
    allowPrerelease: false,
    channel: "latest",
    debug: true,
});
```

### UI Features

The test app now includes:

- **Real-time Status Display**: Shows current update status with visual indicators
- **Progress Tracking**: Visual progress bar during downloads
- **Comprehensive Logging**: Timestamped logs with different severity levels
- **Manual Controls**: Buttons for checking, downloading, and installing updates
- **Auto-check Mode**: Toggle for automatic update checking every 30 seconds
- **Professional UI**: Modern gradient interface with responsive design
- **Developer Tools**: Logs panel for debugging and monitoring

### Release Process

1. Update version in `package.json`
2. Commit changes
3. Create a new tag: `git tag v1.0.1`
4. Push tag: `git push origin v1.0.1`
5. Run `npm run publish` to build and publish to GitHub Releases

The auto-updater will automatically detect new releases and prompt users to update.

## Project Structure

```
src/
├── index.ts          # Main process entry point (enhanced with logging)
├── preload.ts        # Preload script (enhanced with new IPC methods)
├── renderer.ts       # Renderer process entry point
├── index.html        # Main window HTML
├── index.css         # Enhanced styles with Tailwind and custom animations
└── client/           # React components
    ├── App.tsx       # Main UI component with comprehensive update interface
    ├── Notification.tsx # Notification component for user alerts
    ├── index.tsx
    └── globals.css
```

## Testing the Updater

### Basic Testing
1. Build and publish a version to GitHub Releases
2. Install and run the app
3. Use the "Check for Updates" button to manually check
4. Monitor the logs panel for detailed information
5. If an update is found, use "Download Update" to download
6. Use "Install & Restart" to apply the update

### Advanced Testing
1. **Auto-check Mode**: Enable the auto-check toggle to test automatic update detection
2. **Progress Monitoring**: Watch the progress bar during downloads
3. **Error Handling**: Test with invalid configurations to see error logging
4. **Log Analysis**: Use the logs panel to debug update issues
5. **UI Responsiveness**: Test the interface during different update states

### Debugging Features
- **Comprehensive Logging**: All update events are logged with timestamps
- **Status Indicators**: Visual status dots show current update state
- **Progress Tracking**: Real-time download progress with file sizes
- **Error Details**: Detailed error information in both UI and logs
- **Auto-refresh**: Logs update in real-time without manual refresh
