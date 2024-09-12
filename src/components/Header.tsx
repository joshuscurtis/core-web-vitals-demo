import React from 'react';
import { Github } from 'lucide-react';

const Header: React.FC = () => (
  <header className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-800 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          src="/logo.svg"
          alt="Web Vitals Playground Logo"
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold text-gray-100">
          Web Vitals Playground
        </h1>
      </div>
      <a
        href="https://github.com/joshuscurtis"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
      >
        <Github size={24} />
        <span className="hidden sm:inline">GitHub</span>
      </a>
    </div>
  </header>
);

export default Header;