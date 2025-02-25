import React, { useState, useMemo } from 'react';
import { RefreshCw, Eye, EyeOff, Plus, Settings2, X } from 'lucide-react';

const HatPuzzle = () => {
  const DEFAULT_LEFT = ['A'];
  const DEFAULT_RIGHT = ['B', 'C', 'D'];
  
  const [currentPerspective, setCurrentPerspective] = useState(null);
  const [showSetup, setShowSetup] = useState(false);
  const [leftSidePeople, setLeftSidePeople] = useState(DEFAULT_LEFT);
  const [rightSidePeople, setRightSidePeople] = useState(DEFAULT_RIGHT);
  
  const generateDefaultHats = (left, right) => {
    const allPeople = [...left, ...right];
    const hats = {};
    allPeople.forEach((person, index) => {
      hats[person] = index % 2 === 0 ? 'black' : 'white';
    });
    return hats;
  };

  const [hats, setHats] = useState(generateDefaultHats(DEFAULT_LEFT, DEFAULT_RIGHT));

  const hatCounts = useMemo(() => {
    const counts = { black: 0, white: 0 };
    Object.values(hats).forEach(color => {
      counts[color]++;
    });
    return counts;
  }, [hats]);

  const isVisible = (person) => {
    if (!currentPerspective) return true;
    
    const isLeftSide = leftSidePeople.includes(person);
    const currentIsLeftSide = leftSidePeople.includes(currentPerspective);
    
    if (currentIsLeftSide === isLeftSide) {
      const sideArray = currentIsLeftSide ? leftSidePeople : rightSidePeople;
      const currentIdx = sideArray.indexOf(currentPerspective);
      const personIdx = sideArray.indexOf(person);
      return personIdx !== -1 && personIdx < currentIdx;
    }
    
    return false;
  };

  const addPerson = (side) => {
    const allPeople = [...leftSidePeople, ...rightSidePeople];
    const nextLetter = String.fromCharCode(65 + allPeople.length);
    const newHats = { ...hats };
    newHats[nextLetter] = allPeople.length % 2 === 0 ? 'black' : 'white';
    
    if (side === 'left') {
      setLeftSidePeople([...leftSidePeople, nextLetter]);
    } else {
      setRightSidePeople([...rightSidePeople, nextLetter]);
    }
    setHats(newHats);
  };

  const removePerson = (person) => {
    const newHats = { ...hats };
    delete newHats[person];
    
    if (leftSidePeople.includes(person)) {
      setLeftSidePeople(leftSidePeople.filter(p => p !== person));
    } else {
      setRightSidePeople(rightSidePeople.filter(p => p !== person));
    }
    setHats(newHats);
    setCurrentPerspective(null);
  };

  const toggleHatColor = (person) => {
    if (showSetup) {
      setHats(prev => ({
        ...prev,
        [person]: prev[person] === 'black' ? 'white' : 'black'
      }));
    }
  };

  const reset = () => {
    setLeftSidePeople(DEFAULT_LEFT);
    setRightSidePeople(DEFAULT_RIGHT);
    setHats(generateDefaultHats(DEFAULT_LEFT, DEFAULT_RIGHT));
    setCurrentPerspective(null);
    setShowSetup(false);
  };

  // Render a small hat icon for the status bar
  const SmallHat = ({ color }) => (
    <svg width="30" height="50" viewBox="0 0 60 80">
      <path 
        d="M10 40 L30 0 L50 40 Z" 
        fill={color === 'black' ? 'black' : 'white'}
        stroke={color === 'black' ? 'black' : '#888'}
        strokeWidth="2"
      />
    </svg>
  );

  // Render a person with their hat
  const PersonWithHat = ({ person, hatColor, isCurrentPerson }) => {
    const isLeftSide = leftSidePeople.includes(person);
    
    return (
      <svg width="60" height="100" viewBox="0 0 60 100" className="mx-auto">
        {/* Body Base */}
        <g>
          {/* Body */}
          <path d="M30 57 L30 75" stroke="#000" strokeWidth="3"/>
          
          {/* Arms - Direction based */}
          {isLeftSide ? (
            <>
              <path d="M30 65 L45 70" stroke="#000" strokeWidth="2"/>
              <path d="M30 65 L35 75" stroke="#000" strokeWidth="2"/>
            </>
          ) : (
            <>
              <path d="M30 65 L15 70" stroke="#000" strokeWidth="2"/>
              <path d="M30 65 L25 75" stroke="#000" strokeWidth="2"/>
            </>
          )}
          
          {/* Legs */}
          <path d="M30 75 L25 90" stroke="#000" strokeWidth="2"/>
          <path d="M30 75 L35 90" stroke="#000" strokeWidth="2"/>
        </g>

        {/* Head */}
        <circle cx="30" cy="50" r="12" fill="#FFD1B0" stroke="#000" strokeWidth="1"/>
        
        {/* Face Features - Direction based */}
        {isLeftSide ? (
          <>
            {/* Right-facing face */}
            <circle cx="36" cy="48" r="2" fill="#000"/>
            <path d="M32 53 Q36 55 40 53" fill="none" stroke="#000" strokeWidth="1"/>
          </>
        ) : (
          <>
            {/* Left-facing face */}
            <circle cx="24" cy="48" r="2" fill="#000"/>
            <path d="M20 53 Q24 55 28 53" fill="none" stroke="#000" strokeWidth="1"/>
          </>
        )}

        {/* Hat - on top of everything */}
        {!isCurrentPerson && (
          <path 
            d="M20 42 L30 15 L40 42 Z" 
            fill={hatColor === 'black' ? 'black' : 'white'}
            stroke={hatColor === 'black' ? 'black' : '#888'}
            strokeWidth="2"
          />
        )}
        {isCurrentPerson && (
          <path 
            d="M20 45 L30 15 L40 45 Z" 
            fill="none"
            stroke="#888"
            strokeWidth="2"
            strokeDasharray="4"
          />
        )}
      </svg>
    );
  };

  const renderPerson = (person) => {
    const isCurrentPerson = currentPerspective === person;
    const visible = !currentPerspective || isVisible(person);

    return (
      <div className={`relative transition-all duration-300 ${
        isCurrentPerson ? 'opacity-100 z-10' : 
        !visible ? 'opacity-5' : 
        'opacity-100'
      }`}>
        {showSetup && (
          <button
            onClick={() => removePerson(person)}
            className="absolute -top-8 -right-2 p-1 bg-red-100 rounded-full hover:bg-red-200"
          >
            <X size={14} />
          </button>
        )}
        
        <div
          onClick={() => toggleHatColor(person)}
          className={`relative transition-colors duration-300 ${
            showSetup ? 'cursor-pointer hover:scale-110' : ''
          }`}
        >
          <div
            onClick={() => !showSetup && setCurrentPerspective(isCurrentPerson ? null : person)}
            className={`cursor-pointer text-center p-2 rounded transition-all duration-300 ${
              isCurrentPerson ? 
              'bg-yellow-200 ring-4 ring-yellow-400 shadow-lg scale-110' :
              'bg-gray-200'
            }`}
          >
            <PersonWithHat 
              person={person}
              hatColor={hats[person]}
              isCurrentPerson={isCurrentPerson}
            />
            <div className="font-bold mt-2">{person}</div>
            <div className="mt-1">
              {isCurrentPerson ? <Eye size={16} className="mx-auto" /> : <EyeOff size={16} className="mx-auto" />}
            </div>
          </div>
        </div>

        {isCurrentPerson && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-2 py-1 rounded-full text-xs font-bold border border-yellow-400">
            思考中
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-2">规则说明</h2>
        <ul className="space-y-1">
          <li>• 所有人都知道黑白帽子的总数量</li>
          <li>• 每个人只能看到面前人的帽子</li>
          <li>• 一旦确定自己帽子颜色必须立即说出</li>
          <li>• 说错会受罚</li>
        </ul>
      </div>

      {!showSetup && (
        <div className="mb-4 p-4 bg-indigo-50 rounded-lg flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <SmallHat color="black" />
            </div>
            <span className="font-medium">黑帽子：{hatCounts.black}个</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <SmallHat color="white" />
            </div>
            <span className="font-medium">白帽子：{hatCounts.white}个</span>
          </div>
        </div>
      )}

      <div className="relative h-80 bg-gray-100 rounded-lg mb-6 flex items-center justify-around">
        <div className="flex items-center w-1/4 justify-center gap-4">
          {leftSidePeople.map(person => renderPerson(person))}
          {showSetup && (
            <button
              onClick={() => addPerson('left')}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        <div className="h-full w-4 bg-gray-400" />
        
        <div className="flex justify-around w-2/3 gap-4">
          {rightSidePeople.map(person => renderPerson(person))}
          {showSetup && (
            <button
              onClick={() => addPerson('right')}
              className="p-2 bg-blue-100 rounded-full hover:bg-blue-200"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div className="font-medium">
          当前视角: {currentPerspective ? 
            <span className="text-yellow-600 font-bold">{currentPerspective}</span> : 
            '全局'}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setShowSetup(!showSetup);
              setCurrentPerspective(null);
            }}
            className={`flex items-center px-4 py-2 rounded ${
              showSetup ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            <Settings2 size={16} className="mr-2" />
            {showSetup ? '完成设置' : '开始设置'}
          </button>
          <button
            onClick={reset}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <RefreshCw size={16} className="mr-2" />
            重置
          </button>
        </div>
      </div>

      {showSetup && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            设置模式：点击帽子可切换颜色，点击➕添加人物，点击❌删除人物
          </p>
        </div>
      )}
    </div>
  );
};

export default HatPuzzle;