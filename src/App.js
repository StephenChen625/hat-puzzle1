import React, { useState } from 'react';
import HatPuzzle1 from './components/HatPuzzle1';
import HatPuzzle2 from './components/HatPuzzle2';
import HatPuzzle3 from './components/HatPuzzle3';

function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setCurrentPuzzle(1)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                currentPuzzle === 1 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-blue-50 text-blue-600'
              }`}
            >
              问题一：黑白帽子 I
            </button>
            <button
              onClick={() => setCurrentPuzzle(2)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                currentPuzzle === 2 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-blue-50 text-blue-600'
              }`}
            >
              问题二：黑白帽子 II
            </button>
            <button
              onClick={() => setCurrentPuzzle(3)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                currentPuzzle === 3 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-blue-50 text-blue-600'
              }`}
            >
              问题三：黑白帽子 III
            </button>
          </div>
        </div>
      </nav>
      {/* 主内容区 */}
      <main className="container mx-auto py-8 px-4">
        {currentPuzzle === 1 ? <HatPuzzle1 /> :
         currentPuzzle === 2 ? <HatPuzzle2 /> :
         <HatPuzzle3 />}
      </main>
      {/* 页脚 */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-4xl mx-auto px-6 py-4 text-center text-gray-600">
          <p>逻辑推理题集 - 黑白帽子问题</p>
          <p className="mt-1 text-sm">© 2025 <span className="font-medium">孙维刚教育研究院 - 陈硕老师</span>.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
