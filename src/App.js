import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HatPuzzle1 from './components/HatPuzzle1';
import HatPuzzle2 from './components/HatPuzzle2';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex gap-4">
              <Link to="/" className="px-4 py-2 rounded hover:bg-blue-100 text-blue-600">
                问题一：黑白帽子 I
              </Link>
              <Link to="/puzzle2" className="px-4 py-2 rounded hover:bg-blue-100 text-blue-600">
                问题二：黑白帽子 II
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<HatPuzzle1 />} />
            <Route path="/puzzle2" element={<HatPuzzle2 />} />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-8">
          <div className="max-w-4xl mx-auto px-6 py-4 text-center text-gray-600">
            <p>逻辑推理题集 - 黑白帽子问题</p>
            <p className="mt-1 text-sm">© 2025 <span className="font-medium">孙维刚教育研究院 - 陈硕老师</span>.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
