'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Logo from './Logo.png';
import { FaPaperPlane } from 'react-icons/fa';
import './InputForm.css';
  
const InputForm = () => {
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isConversationVisible, setIsConversationVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [promptsRemaining, setPromptsRemaining] = useState(6);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [userId, setUserId] = useState(''); 

function generateUniqueUserId() {
  const timestamp = new Date().getTime();
  return `user-${timestamp}`;
}

  useEffect(() => {
    let localUserId = localStorage.getItem('userId');
    if (!localUserId) {
      localUserId = generateUniqueUserId();
      localStorage.setItem('userId', localUserId);
    }
    setUserId(localUserId);
  }, []);
  useEffect(() => {
    const lastPromptTime = localStorage.getItem('lastPromptTime');
    const storedPromptsUsed = localStorage.getItem('promptsUsed');
    if (lastPromptTime && storedPromptsUsed) {
      const elapsedTime = Date.now() - parseInt(lastPromptTime);
      const promptsUsed = parseInt(storedPromptsUsed, 10);

      if (elapsedTime < 24 * 60 * 60 * 1000) {
        setPromptsUsed(promptsUsed);
        setPromptsRemaining(6 - promptsUsed);
        const remainingTime = 24 * 60 * 60 * 1000 - elapsedTime;
        setTimeRemaining(remainingTime);
        startTimer(remainingTime);
      } else {
        setPromptsUsed(0);
        setPromptsRemaining(6);
        setTimeRemaining(0);
      }
    }
  }, []);
  
  const startTimer = (remainingTime) => {
    const intervalId = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime -= 1000;
        setTimeRemaining(remainingTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  };

  const formatTime = (time) => {
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);

    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  useEffect(() => {
    const fetchPromptStatus = async () => {
      try {
        const response = await axios.get('https://ec2-3-144-166-179.us-east-2.compute.amazonaws.com/'); 
        const { promptsUsed, timeRemaining } = response.data;
        setPromptsUsed(promptsUsed);
        setPromptsRemaining(6 - promptsUsed); 
        setTimeRemaining(timeRemaining);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPromptStatus();
  }, []);

  const handleUserInput = async () => {
    try {
      setIsLoading(true);

      if (promptsRemaining <= 0) {
        alert(`Your daily limit is complete. Try after ${formatTime(timeRemaining)}`);
        setIsLoading(false); 
        return;
      }
      
     
      setPromptsRemaining((prevPromptsRemaining) => prevPromptsRemaining - 1);
      setPromptsUsed((prevPromptsUsed) => prevPromptsUsed + 1);
      localStorage.setItem('promptsUsed', promptsUsed + 1);

      
      const config = require('./config');
    
      const openaiApiKey = config.openaiApiKey;
      const options = {
        method: 'POST',
        url: 'https://api.openai.com/v1/engines/text-davinci-002/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        data: {
          prompt: userInput,
          max_tokens: 500,
        }
      };

      const response = await axios(options);
      const botResponse = response.data.choices[0].text;

      const updatedConversation = [
        ...conversation,
        { type: 'user', text: userInput },
        { type: 'bot', text: botResponse },
      ];
      setConversation(updatedConversation);

      const userPrompt = userInput.split(' ').slice(0, 4).join('');
      const updatedUserHistory = [
        ...userHistory,
        { prompt: userPrompt, response: botResponse, conversation: updatedConversation },
      ];

      setPromptsRemaining((prevPromptsRemaining) => prevPromptsRemaining - 1); 
      setUserHistory(updatedUserHistory);
      saveUserHistoryToLocalStorage();

      setUserInput('');

      const currentTime = Date.now();
      localStorage.setItem('lastPromptTime', currentTime.toString());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

 

    useEffect(() => {
      const lastPromptTime = localStorage.getItem('lastPromptTime');
      const storedPromptsUsed = localStorage.getItem('promptsUsed');
      if (lastPromptTime && storedPromptsUsed) {
        const elapsedTime = Date.now() - parseInt(lastPromptTime);
        const promptsUsed = parseInt(storedPromptsUsed, 10);
    
        if (elapsedTime < 24 * 60 * 60 * 1000) {
          setPromptsUsed(promptsUsed);
          setPromptsRemaining(6 - promptsUsed);
        } else {
          setPromptsUsed(0);
          setPromptsRemaining(6);
        }
      }
    }, []);
    

  useEffect(() => {
    const storedPromptsUsed = localStorage.getItem('promptsUsed');
    if (storedPromptsUsed) {
      setPromptsUsed(parseInt(storedPromptsUsed, 10));
    }
  }, []);

  const saveUserHistoryToLocalStorage = () => {
    localStorage.setItem('userHistory', JSON.stringify(userHistory));
  };

  const handleButtonClick = (prompt) => {
    if (prompt === 'Any Other Question or Chat with GameSoI AI') {
      setIsConversationVisible(!isConversationVisible);
    } else {
      setUserInput(prompt);
      handleUserInput();
      setIsConversationVisible(true);
    }
  };
  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };
  const buttonPrompts = [
    'Discover top consoles that meet your needs',
    'Get concise steps for a full OS reinstallation',
    'Discover top computers that meet your needs',
    'Receive tips to boost your gaming skills',
    'Discover top laptops that meet your needs',
    'Get mobile game recommendations',
    'Discover top monitors that meet your needs',
    'Discover top monitors that meet your needs',
    'Get PC and console game recommendations',
    'Get Coupon code for games and consoles',
    'Any Other Question or Chat with GameSoI AI',
  ];

  return (
    <section className="w-screen overflow-hidden">
      <nav className="flex">
        <Image src={Logo} height={150} width={150} alt="Logo" />
        <ul className="text-xl text-white whitespace-nowrap flex gap-3 px-10 mt-[43px] sm:px-[75%] sm:mt-7">
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div className="w-screen flex flex-col text-center text-white">
        <h1 className="text-7xl font-bold">Gamers Solution AI</h1>
        <p>Unlocking Victory with Unrivaled Intelligence</p>
      </div>
      <div className="text-white ml-5 grid grid-cols-1 sm:grid-cols-3 gap-3 mr-3 sm:px-20 mt-20 mb-8 hover:border-yellow-200">
        {buttonPrompts.map((prompt, index) => (
          <button
            key={index}
            className={` hover:bg-gray-700 px-2 py-2 rounded border-[3px] border-[#33ccff] ${
              index === buttonPrompts.length - 1
                ? 'text-white text-xl font-semibold  border-[3px] hover-bg-slate-900 border-[#ff99cc]'
                : ''
            }`}
            onClick={() => handleButtonClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {isConversationVisible && (
        <div className="w-screen h-[400px] mt-10 border-[2px] border-slate-300 rounded relative ">
          <div className="h-[300px] overflow-auto">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`message ml-6 mt-2 w-[90%]  ${
                  message.type === 'user' ? 'bg-gray-600 py-2 rounded-lg px-2 ' : ''
                } text-white`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="absolute w-screen bottom-0 mb-5">
            <div className="w-full flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleInputKeyPress}
                className="bg-[transparent] border-[2px] border-gray-500 w-[90%] rounded py-2 px-2 text-white ml-3"
                placeholder="Send a message"
              />
              <div
                className="text-white cursor-pointer -ml-7"
                onClick={handleUserInput}
              >
                <FaPaperPlane />
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <style jsx>
        {`
          .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div className="w-screen text-white text-center mt-5">
        <p>Prompts remaining in 24 hours: {promptsRemaining}</p>
        {promptsRemaining <= 0 && (
          <p>Time remaining: {formatTime(timeRemaining)}</p>
        )}
      </div>
    </section>
  );
};

export default InputForm;
 