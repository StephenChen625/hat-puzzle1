import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const HatPuzzle2 = () => {
  const INITIAL_HATS = {
    A: 'white',
    B: 'white',
    C: 'white'
  };
  
  const [people, setPeople] = useState(['A', 'B', 'C']);
  const [currentStep, setCurrentStep] = useState(0);
  const [hats, setHats] = useState(INITIAL_HATS);
  const [answers, setAnswers] = useState({
    A: null,
    B: null,
    C: null
  });
  const [showSetup, setShowSetup] = useState(false);
  const [exploringPerson, setExploringPerson] = useState(null);

  const totalHats = {
    white: 3,
    black: 2
  };

  const getCurrentPerson = () => {
    if (showSetup) {
      return exploringPerson;
    }
    return currentStep > 0 ? people[currentStep - 1] : null;
  };

  // 判断人物是否应该透明（在思考者左边的人透明）
  const shouldBeTransparent = (person) => {
    const currentPerson = getCurrentPerson();
    if (!currentPerson) return false;
    if (person === currentPerson) return false; // 思考者本人不透明
    
    const currentIdx = people.indexOf(currentPerson);
    const personIdx = people.indexOf(person);
    return personIdx < currentIdx; // 在思考者左边的人透明
  };

  // 判断帽子是否应该是虚框（当前思考者的帽子是虚框）
  const shouldShowDashedHat = (person) => {
    const currentPerson = getCurrentPerson();
    return person === currentPerson;
  };

  const handleReset = () => {
    setPeople(['A', 'B', 'C']);
    setCurrentStep(0);
    setHats(INITIAL_HATS);
    setAnswers({
      A: null,
      B: null,
      C: null
    });
    setShowSetup(false);
    setExploringPerson(null);
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      const newAnswers = { ...answers };
      people.forEach((person, idx) => {
        if (idx >= currentStep - 2) {
          newAnswers[person] = null;
        }
      });
      setAnswers(newAnswers);
    }
  };

  const renderPersonWithHat = (person) => {
    const isCurrentPerson = getCurrentPerson() === person;
    const isTransparent = shouldBeTransparent(person);
    const showDashedHat = shouldShowDashedHat(person);
    
    return (
      <svg width="60" height="100" viewBox="0 0 60 100" className="mx-auto">
        {/* Body and face - opacity based on visibility */}
        <g className={`transition-opacity duration-300 ${isTransparent ? 'opacity-5' : 'opacity-100'}`}>
          <path d="M30 57 L30 75" stroke="#000" strokeWidth="3"/>
          <path d="M30 65 L45 70" stroke="#000" strokeWidth="2"/>
          <path d="M30 65 L35 75" stroke="#000" strokeWidth="2"/>
          <path d="M30 75 L25 90" stroke="#000" strokeWidth="2"/>
          <path d="M30 75 L35 90" stroke="#000" strokeWidth="2"/>
          <circle cx="30" cy="50" r="12" fill="#FFD1B0" stroke="#000" strokeWidth="1"/>
          <circle cx="36" cy="48" r="2" fill="#000"/>
          <path d="M32 53 Q36 55 40 53" fill="none" stroke="#000" strokeWidth="1"/>
        </g>

        {/* Hat - with independent opacity and dashed/solid style */}
        <path 
          d="M20 42 L30 15 L40 42 Z" //d="M20 42 L30 15 L40 42 Z"
          className={`transition-opacity duration-300 ${isTransparent ? 'opacity-5' : 'opacity-100'}`}
          fill={showDashedHat ? 'none' : hats[person] === 'black' ? 'black' : 'white'}
          stroke={hats[person] === 'black' ? 'black' : '#888'}
          strokeWidth="2"
          strokeDasharray={showDashedHat ? '4' : '0'}
        />
      </svg>
    );
  };

  const renderAnswer = (person) => {
    if (showSetup) return null; // 探索模式下不显示回答

    const isCurrentPerson = currentStep === people.indexOf(person) + 1;

    if (!isCurrentPerson && answers[person] === null) {
      return null;
    }

    if (isCurrentPerson) {
      return (
        <div className="mt-2 flex gap-2 justify-center">
          <button 
            onClick={() => {
              setAnswers(prev => ({...prev, [person]: true}));
              setCurrentStep(step => step + 1);
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            知道
          </button>
          <button 
            onClick={() => {
              setAnswers(prev => ({...prev, [person]: false}));
              setCurrentStep(step => step + 1);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            不知道
          </button>
        </div>
      );
    }

    return (
      <div className="mt-2 text-center font-bold">
        {answers[person] ? "知道" : "不知道"}
      </div>
    );
  };

  const removePerson = (personToRemove) => {
    if (people.length <= 3) return; // 不允许少于3人
    setPeople(people.filter(p => p !== personToRemove));
    setHats(prev => {
      const newHats = {...prev};
      delete newHats[personToRemove];
      return newHats;
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-2">规则说明</h2>
        <ul className="space-y-1">
          <li>• 一共有5顶帽子（3白2黑）</li>
          <li>• 每个人能看到前面（右边）所有人的帽子</li>
          <li>• 按顺序回答是否知道自己帽子的颜色</li>
          <li>• 回答时只能说"知道"或"不知道"</li>
        </ul>
      </div>

      <div className="mb-4 p-4 bg-indigo-50 rounded-lg flex items-center justify-center">
        <div className="font-medium flex items-center">
          <span className="mr-4">总共：</span>
          <div className="flex items-center mr-8">
            <svg width="24" height="24" viewBox="0 0 40 40" className="inline-block">
              <path 
                d="M10 30 L20 10 L30 30 Z" 
                fill="white"
                stroke="#888"
                strokeWidth="2"
              />
            </svg>
            <span className="ml-1">×{totalHats.white}</span>
          </div>
          <div className="flex items-center">
            <svg width="24" height="24" viewBox="0 0 40 40" className="inline-block">
              <path 
                d="M10 30 L20 10 L30 30 Z" 
                fill="black"
                stroke="black"
                strokeWidth="2"
              />
            </svg>
            <span className="ml-1">×{totalHats.black}</span>
          </div>
        </div>
      </div>

      <div className="relative h-80 bg-gray-100 rounded-lg mb-6 flex items-center justify-around">
        {people.map((person) => (
          <div 
            key={person}
            onClick={() => showSetup && setExploringPerson(person)}
            className={`relative transition-all duration-300 p-4 rounded-lg ${
              getCurrentPerson() === person ? 'bg-yellow-100 ring-4 ring-yellow-400' : ''
            } ${showSetup ? 'cursor-pointer' : ''}`}
          >
            {showSetup && (
              <>
                <select
                  value={hats[person]}
                  onChange={(e) => setHats(prev => ({
                    ...prev,
                    [person]: e.target.value
                  }))}
                  onClick={(e) => e.stopPropagation()} // 防止触发人物选择
                  className="absolute left-1/2 transform -translate-x-1/2 -top-4 z-10 rounded border p-1 bg-white text-sm"
                >
                  <option value="white">白色</option>
                  <option value="black">黑色</option>
                </select>
                {people.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePerson(person);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full z-10"
                  >
                    <X size={14} />
                  </button>
                )}
              </>
            )}
            {renderPersonWithHat(person)}
            <div className="font-bold text-center mt-2">{person}</div>
            {renderAnswer(person)}
          </div>
        ))}
        {showSetup && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                const nextLetter = String.fromCharCode(65 + people.length);
                setPeople([...people, nextLetter]);
                setHats(prev => ({
                  ...prev,
                  [nextLetter]: people.length % 2 === 0 ? 'white' : 'black'
                }));
              }}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={handleStepBack}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            上一步
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重置
          </button>
          {currentStep === 0 && (
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              开始
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setShowSetup(!showSetup);
            setExploringPerson(null);
          }}
          className={`px-4 py-2 rounded ${
            showSetup ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'
          } text-white`}
        >
          {showSetup ? '完成探索' : '探索模式'}
        </button>
      </div>

      {showSetup && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-700">
            探索模式：点击人物切换视角，使用下拉框修改帽子颜色，点击➕添加新人，点击❌删除人物（最少保留3人）
          </p>
        </div>
      )}
    </div>
  );
};

export default HatPuzzle2;
