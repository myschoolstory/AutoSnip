import React from 'react';
import { AudioProvider } from './context/AudioContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioSplitter from './components/AudioSplitter';

function App() {
  return (
    <AudioProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <AudioSplitter />
        </main>
        <Footer />
      </div>
    </AudioProvider>
  );
}

export default App;