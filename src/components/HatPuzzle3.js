import React, { useState, useEffect } from 'react';
import { Settings2, RefreshCw, Plus, Minus, Moon } from 'lucide-react';

const HatPuzzle3 = () => {
  const DEFAULT_PEOPLE_COUNT = 7;
  const DEFAULT_BLACK_HAT_COUNT = 3;
  
  const [peopleCount, setPeopleCount] = useState(DEFAULT_PEOPLE_COUNT);
  const [blackHatCount, setBlackHatCount] = useState(DEFAULT_BLACK_HAT_COUNT);
  const [people, setPeople] = useState([]);
  const [currentThinker, setCurrentThinker] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [roundCount, setRoundCount] = useState(0);
  const [lightsOn, setLightsOn] = useState(true);
  
  // 生成随机位置和帽子
  useEffect(() => {
    generatePeople();
  }, []);
  
  // 当黑帽子数量变化时，更新人物
  useEffect(() => {
    if (showSetup) {
      updateBlackHatCount();
    }
  }, [blackHatCount, showSetup]);
  
  const generatePeople = () => {
    // 确保黑帽子数量不超过总人数
    const safeBlackHatCount = Math.min(blackHatCount, peopleCount);
    
    // 创建人物数组
    const newPeople = [];
    const minDistance = 15; // 最小间距（百分比）
    const positions = [];
    
    // 生成所有人物
    for (let i = 0; i < peopleCount; i++) {
      let x, y;
      let validPosition = false;
      
      // 尝试找到一个与已有位置保持最小距离的新位置
      let attempts = 0;
      while (!validPosition && attempts < 100) {
        x = 15 + Math.random() * 70; // 15%-85%的可视区域
        y = 15 + Math.random() * 70;
        
        validPosition = true;
        // 检查与已有位置的距离
        for (const pos of positions) {
          const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
        
        attempts++;
      }
      
      // 如果尝试多次仍找不到合适位置，则放宽条件
      if (!validPosition) {
        x = 15 + Math.random() * 70;
        y = 15 + Math.random() * 70;
      }
      
      positions.push({ x, y });
      
      // 黑帽子分配
      const hatColor = i < safeBlackHatCount ? 'black' : 'white';
      
      newPeople.push({
        id: i,
        hatColor,
        x: `${x}%`,
        y: `${y}%`,
      });
    }
    
    // 随机洗牌帽子颜色
    for (let i = newPeople.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newPeople[i].hatColor;
      newPeople[i].hatColor = newPeople[j].hatColor;
      newPeople[j].hatColor = temp;
    }
    
    setPeople(newPeople);
  };
  
  const updateBlackHatCount = () => {
    // 调整黑帽子数量，但保持人的位置不变
    setPeople(prevPeople => {
      const newPeople = [...prevPeople];
      let currentBlackCount = newPeople.filter(p => p.hatColor === 'black').length;
      
      // 如果当前黑帽子数量需要增加
      while (currentBlackCount < blackHatCount && currentBlackCount < peopleCount) {
        // 找一个白帽子改成黑帽子
        const whiteIndices = newPeople
          .map((p, idx) => p.hatColor === 'white' ? idx : -1)
          .filter(idx => idx !== -1);
        
        if (whiteIndices.length > 0) {
          const randomIndex = whiteIndices[Math.floor(Math.random() * whiteIndices.length)];
          newPeople[randomIndex].hatColor = 'black';
          currentBlackCount++;
        } else {
          break;
        }
      }
      
      // 如果当前黑帽子数量需要减少
      while (currentBlackCount > blackHatCount && currentBlackCount > 1) {
        // 找一个黑帽子改成白帽子
        const blackIndices = newPeople
          .map((p, idx) => p.hatColor === 'black' ? idx : -1)
          .filter(idx => idx !== -1);
        
        if (blackIndices.length > 0) {
          const randomIndex = blackIndices[Math.floor(Math.random() * blackIndices.length)];
          newPeople[randomIndex].hatColor = 'white';
          currentBlackCount--;
        } else {
          break;
        }
      }
      
      return newPeople;
    });
  };
  
  const handleReset = () => {
    generatePeople();
    setCurrentThinker(null);
    setRoundCount(0);
    setLightsOn(true);
  };
  
  const handlePeopleCountChange = (count) => {
    setPeopleCount(count);
    
    // 确保黑帽子数量不超过总人数
    if (blackHatCount > count) {
      setBlackHatCount(count);
    }
  };
  
  const toggleHatColor = (id) => {
    if (!showSetup) return;
    
    setPeople(prevPeople => {
      const updatedPeople = [...prevPeople];
      const index = updatedPeople.findIndex(p => p.id === id);
      
      if (index !== -1) {
        const currentHatColor = updatedPeople[index].hatColor;
        const newHatColor = currentHatColor === 'black' ? 'white' : 'black';
        
        // 更新黑帽子数量
        if (newHatColor === 'black') {
          setBlackHatCount(prev => prev + 1);
        } else {
          setBlackHatCount(prev => prev - 1);
        }
        
        updatedPeople[index] = {
          ...updatedPeople[index],
          hatColor: newHatColor
        };
      }
      
      return updatedPeople;
    });
  };
  
  const advanceRound = () => {
    if (lightsOn) {
      // 关灯
      setLightsOn(false);
      setRoundCount(prev => prev + 1);
    } else {
      // 开灯
      setLightsOn(true);
    }
  };
  
  const renderPerson = (person) => {
    const isThinking = currentThinker === person.id;
    
    return (
      <div 
        key={person.id}
        className={`absolute transition-all duration-300 ${
          isThinking ? 'z-10 scale-110' : ''
        }`}
        style={{
          left: person.x,
          top: person.y,
          transform: `translate(-50%, -50%)`,
          cursor: 'pointer',
        }}
        onClick={() => {
          if (!showSetup) {
            // 点击当前思考的人，取消思考状态
            if (currentThinker === person.id) {
              setCurrentThinker(null);
            } else {
              setCurrentThinker(person.id);
            }
          }
        }}
      >
        <div className="relative">
          {/* Hat - upward pointing triangle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <svg width="40" height="40" viewBox="0 0 60 60">
              <path 
                d="M8 47 L30 0 L52 47 Z" 
                fill={isThinking ? 'none' : (person.hatColor === 'black' ? 'black' : 'white')}
                stroke={person.hatColor === 'black' ? 'black' : '#888'}
                strokeWidth="2"
                strokeDasharray={isThinking ? '4' : '0'}
                onClick={(e) => {
                  if (showSetup) {
                    e.stopPropagation();
                    toggleHatColor(person.id);
                  }
                }}
                className={`${showSetup ? 'cursor-pointer hover:opacity-80' : ''}`}
              />
            </svg>
          </div>
          
          {/* Person - simple circle with number */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isThinking ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-100 border-gray-300'
          } border-2`}>
            <span className="text-xs font-bold">
              {person.id + 1}
            </span>
          </div>
          
          {/* Thinking indicator */}
          {isThinking && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-2 py-0.5 rounded-full text-xs border border-yellow-400 whitespace-nowrap">
              思考中
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-2">问题三：黑白帽子 III</h2>
        <ul className="space-y-1">
          <li>• 每人头上戴着一顶黑或白帽子</li>
          <li>• 每个人都能看到其他人帽子的颜色</li>
          <li>• 黑帽子至少有一顶</li>
          <li>• 如果确定自己戴的是黑帽子，关灯时请鼓掌</li>
        </ul>
      </div>
      
      <div className="mb-4 p-4 bg-indigo-50 rounded-lg flex items-center justify-center">
        <div className="font-medium flex items-center">
          <span>共识：至少有一顶黑帽子</span>
        </div>
      </div>
      
      <div className={`relative h-96 rounded-lg mb-6 overflow-hidden border-2 border-gray-300 transition-all duration-500 ${
        !lightsOn ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        {/* Dark overlay when lights are off - more transparent */}
        {!lightsOn && (
          <div className="absolute inset-0 bg-black bg-opacity-60 z-10 pointer-events-none"></div>
        )}
        
        {/* Room with people */}
        <div className={`relative w-full h-full transition-all duration-500 ${
          !lightsOn ? 'opacity-60 contrast-110 brightness-75' : ''
        }`}>
          {people.map(person => renderPerson(person))}
        </div>
        
        {/* Current round indicator */}
        {!showSetup && (
          <div className={`absolute top-2 left-2 px-3 py-1 rounded-full font-medium z-20 ${
            lightsOn ? 'bg-blue-100 text-blue-800' : 'bg-yellow-500 text-white'
          }`}>
            关灯次数: {roundCount}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            重置
          </button>
          {!showSetup && (
            <button
              onClick={advanceRound}
              className={`px-4 py-2 rounded flex items-center ${
                lightsOn ? 
                'bg-purple-500 hover:bg-purple-600' : 
                'bg-yellow-500 hover:bg-yellow-600'
              } text-white`}
            >
              <Moon size={16} className="mr-2" />
              {lightsOn ? '关灯' : '开灯'}
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowSetup(!showSetup)}
          className={`px-4 py-2 rounded flex items-center ${
            showSetup ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {showSetup ? (
            <>
              开始推理
            </>
          ) : (
            <>
              <Settings2 size={16} className="mr-2" />
              设置模式
            </>
          )}
        </button>
      </div>
      
      {showSetup && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-white rounded-lg border">
            <h3 className="font-bold mb-3">设置</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 font-medium">总人数: {peopleCount}</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePeopleCountChange(Math.max(3, peopleCount - 1))}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={peopleCount <= 3}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    value={peopleCount}
                    onChange={(e) => handlePeopleCountChange(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <button 
                    onClick={() => handlePeopleCountChange(Math.min(15, peopleCount + 1))}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={peopleCount >= 15}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">黑帽子数量: {blackHatCount}</label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setBlackHatCount(Math.max(1, blackHatCount - 1))}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={blackHatCount <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max={peopleCount}
                    value={blackHatCount}
                    onChange={(e) => setBlackHatCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <button 
                    onClick={() => setBlackHatCount(Math.min(peopleCount, blackHatCount + 1))}
                    className="p-1 bg-gray-200 hover:bg-gray-300 rounded"
                    disabled={blackHatCount >= peopleCount}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <button 
                onClick={generatePeople}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                随机生成
              </button>
              
              <p className="text-sm text-gray-600">
                点击人物帽子可以切换帽子颜色。保存前请确保黑帽子数量不少于1顶。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HatPuzzle3;