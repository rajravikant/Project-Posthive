# Project-Posthive

A modern mobile blogging platform built with React Native and Expo.

## Overview

Project-Posthive is a feature-rich blogging application that enables users to create, publish, and interact with blog content. The platform focuses on providing a seamless user experience with a modern UI design and rich text editing capabilities.

## Features

### Core Features
- **User Authentication**: Complete login/registration system with token refresh
- **Rich Text Editor**: Create formatted blog posts with images and styling
- **Blog Management**: Create, edit, publish, and delete posts
- **Social Interactions**: Comment on posts and engage with other users
- **Profile Management**: Custom user profiles with avatars
- **Content Discovery**: Browse, search, and filter posts by categories/tags
- **Bookmarks**: Save favorite content for later reading
- **Theme Support**: Light and dark mode

### Technical Features
- Built with React Native and Expo
- TypeScript for type safety
- React Navigation for routing
- NativeWind (Tailwind CSS) for styling
- React Query for efficient data fetching and cache
- React Native Pell Rich Editor for the editor
- Cross-platform support (iOS and Android)

## Installation

### Prerequisites
- Node.js (v16 or later)
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/your-username/Project-Posthive.git
cd Project-Posthive
```

2. Install dependencies
```bash
npm install
# or
bun install
```

3. Apply patches (for rich text editor)
```bash
npx patch-package
```

4. Start the development server
```bash
npx expo start
```

## Project Structure

```
src/
  ├── api/           # API integration and hooks
  ├── app/           # App screens and navigation (Expo Router)
  ├── assets/        # Fonts, images, and icons
  ├── components/    # Reusable UI components
  ├── constants/     # Theme and static data
  ├── hooks/         # Custom React hooks
  ├── store/         # State management
  ├── types/         # TypeScript type definitions
  └── utils/         # Utility functions
```

## Dependencies

Key dependencies include:
- expo
- react-native
- @react-navigation
- nativewind
- @tanstack/react-query
- react-native-pell-rich-editor
- expo-router
- zustand
- @react-native-google-signin/google-signin
- @gorhom/bottom-sheet

For a complete list, see the `package.json` file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
