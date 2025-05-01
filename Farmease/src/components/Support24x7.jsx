import React from 'react';
import { motion } from 'framer-motion';

const Support24x7 = ({ onTopicSelect }) => {
  const supportTopics = [
    'Crop Management',
    'Pest Control',
    'Soil Health',
    'Weather Updates',
    'Irrigation Tips',
    'Disease Prevention',
    'Organic Farming',
    'Market Prices'
  ];

  const handleTopicClick = (topic) => {
    const chatbotTrigger = document.querySelector('[data-chatbot-trigger]');
    if (chatbotTrigger) {
      onTopicSelect(topic);
      chatbotTrigger.click();
    }
  };

  return (
    <section className="py-16 bg-white" id="support">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            24/7 Farming Support
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Get instant help with your farming queries anytime, anywhere
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Instant Support */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative p-6 bg-white rounded-xl shadow-md border border-green-100"
            >
              <div className="absolute top-6 left-6 bg-green-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-medium text-gray-900">Instant Responses</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get immediate answers to your farming questions through our AI-powered assistant
                </p>
              </div>
            </motion.div>

            {/* Feature 2: Expert Knowledge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative p-6 bg-white rounded-xl shadow-md border border-green-100"
            >
              <div className="absolute top-6 left-6 bg-green-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-medium text-gray-900">Expert Knowledge</h3>
                <p className="mt-2 text-base text-gray-500">
                  Access comprehensive farming knowledge curated by agricultural experts
                </p>
              </div>
            </motion.div>

            {/* Feature 3: 24/7 Availability */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative p-6 bg-white rounded-xl shadow-md border border-green-100"
            >
              <div className="absolute top-6 left-6 bg-green-100 rounded-lg p-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                </svg>
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-medium text-gray-900">Always Available</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get support 24/7, 365 days a year, whenever you need assistance
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTopicClick('general')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Start Chat Support
          </motion.button>
          <p className="mt-4 text-sm text-gray-500">
            Our AI assistant is ready to help you with any farming-related questions
          </p>
        </div>

        {/* Quick Access Support Topics */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
            Quick Access Support Topics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportTopics.map((topic, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTopicClick(topic)}
                className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200"
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support24x7; 