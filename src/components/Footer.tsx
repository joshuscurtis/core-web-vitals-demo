import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-gray-800 bg-opacity-50 py-6 px-3 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-400 text-sm mb-2 md:mb-0">
        A project by Josh. Built with React and Tailwind CSS.
      </p>
      <nav className="flex space-x-4"></nav>
    </div>
  </footer>
);

export default Footer;
