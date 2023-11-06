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

  // Load user history from local storage on component mount
  useEffect(() => {
    const storedUserHistory = JSON.parse(localStorage.getItem('userHistory'));
    if (storedUserHistory) {
      setUserHistory(storedUserHistory);
    }
  }, []);

  // Function to save user history to local storage
  const saveUserHistoryToLocalStorage = () => {
    localStorage.setItem('userHistory', JSON.stringify(userHistory));
  };

  const handleUserInput = async () => {
    try {
      setIsLoading(true); // Show the loader

      const options = {
        method: 'POST',
        url: 'https://api.openai.com/v1/engines/text-davinci-002/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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', // Replace with your OpenAI API key
        },
        data: {
          prompt: userInput,
          max_tokens: 500, // Adjust as needed
        }
      };

      const response = await axios(options);

      const botResponse = response.data.choices[0].text;

      setConversation((prevConversation) => [
        ...prevConversation,
        { type: 'user', text: userInput },
        { type: 'bot', text: botResponse },
      ]);

      // Save user history
      const userPrompt = userInput.split(' ').slice(0, 4).join(' '); // Get the first 4 words of the user's input
      setUserHistory((prevUserHistory) => [
        ...prevUserHistory,
        { prompt: userPrompt, response: botResponse, conversation: [...conversation] },
      ]);
      saveUserHistoryToLocalStorage();

      setUserInput('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Hide the loader
    }
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

  const handleUserHistoryClick = (historyItem) => {
    // Show the full conversation for the selected user history item
    setConversation(historyItem.conversation);
    setIsConversationVisible(true);
  };

  const buttonPrompts = [
    'Discover top computers that meet your needs',
    'Receive tips to boost your gaming skills',
    'Discover top laptops that meet your needs',
    'Get mobile game recommendations',
    'Discover top monitors that meet your needs',
    'Discover top monitors that meet your needs',
    'Any Other Question or Chat with GameSoI AI',
  ];

  return (
    <section className="w-screen">
      <nav className="flex">
        <Image src={Logo} height={150} width={150} alt="Logo" />
        <ul className="text-xl text-white whitespace-nowrap flex gap-3 px-[75%] mt-7">
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div className="w-screen flex flex-col text-center text-white">
        <h1 className="text-7xl font-bold">Gamers Solution AI</h1>
        <p>Unlocking Victory with Unrivaled Intelligence</p>
      </div>
      <div className="text-white ml-5 grid grid-cols-1 sm:grid-cols-3 gap-3 px-20 mt-20">
        {buttonPrompts.map((prompt, index) => (
          <button
            key={index}
            className={`bg-gray-600 hover:bg-gray-700 px-2 py-2 rounded border-[3px] ${
              index === buttonPrompts.length - 1 ? 'text-yellow-800 text-xl font-semibold bg-red-100 border-[3px] hover-bg-slate-200' : ''
            }`}
            onClick={() => handleButtonClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      {isConversationVisible && (
        <div className="w-screen h-[500px] mt-10 border-[2px] border-slate-300 rounded relative">
          <div className="h-[400px] overflow-auto">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`message ml-6 mt-2 overflow-auto w-[90%] ${
                  message.type === 'user' ? 'bg-gray-600 rounded px-2 py-2' : ''
                } text-white`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="absolute w-screen -mt-[40%]">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleInputKeyPress}
              className="absolute bg-[transparent]  border-[2px] border-gray-500 w-[90%] mt-[42%] ml-4 rounded py-2 px-2 text-white"
              placeholder="Send a message"
            />
            <div className="text-white ml-[85%] sm:ml-[88%] sm:mt-[43%] mt-[46%] cursor-pointer absolute" onClick={handleUserInput}>
              <FaPaperPlane />
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
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

     
    </section>
  );
};

export default InputForm;
