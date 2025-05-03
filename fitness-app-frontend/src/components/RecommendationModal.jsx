import React from 'react';
import { IoClose } from 'react-icons/io5'; // nice close icon
import { motion } from 'framer-motion';


const RecommendationModal = ({ recommendationData, onClose }) => {
    if (!recommendationData) return null;

    const { recommendation, improvements, suggestions, safety } = recommendationData;

    // Helper function to parse recommendation into sections
    const parseRecommendation = (text) => {
        const sections = {
            overall: '',
            pace: '',
            heartRate: '',
            caloriesBurned: '',
        };

        if (!text) return sections;

        const regex = /Overall:(.*?)Pace:(.*?)Heart Rate:(.*?)Calories Burned:(.*)/s;
        const match = text.match(regex);

        if (match) {
            sections.overall = match[1]?.trim();
            sections.pace = match[2]?.trim();
            sections.heartRate = match[3]?.trim();
            sections.caloriesBurned = match[4]?.trim();
        } else {
            sections.overall = text.trim(); // fallback if format not matching
        }

        return sections;
    };

    const parsed = parseRecommendation(recommendation);

    return (

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-30 backdrop-blur-md"
        >
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl mx-4 p-6 relative overflow-hidden">

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl"
                    >
                        <IoClose />
                    </button>

                    {/* Modal Scrollable Content */}
                    <div className="overflow-y-auto max-h-[80vh] pr-4">
                        <h2 className="text-3xl font-bold mb-6 text-center">Activity Analysis</h2>

                        {/* Overall Section */}
                        {parsed.overall && (
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Overall</h3>
                                <p className="text-gray-800 whitespace-pre-line">{parsed.overall}</p>
                            </section>
                        )}

                        {/* Pace Section */}
                        {parsed.pace && (
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Pace</h3>
                                <p className="text-gray-800 whitespace-pre-line">{parsed.pace}</p>
                            </section>
                        )}

                        {/* Heart Rate Section */}
                        {parsed.heartRate && (
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Heart Rate</h3>
                                <p className="text-gray-800 whitespace-pre-line">{parsed.heartRate}</p>
                            </section>
                        )}

                        {/* Calories Burned Section */}
                        {parsed.caloriesBurned && (
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Calories Burned</h3>
                                <p className="text-gray-800 whitespace-pre-line">{parsed.caloriesBurned}</p>
                            </section>
                        )}

                        {/* Improvements */}
                        {improvements && improvements.length > 0 && (
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Improvements</h3>
                                <div className="space-y-4">
                                    {improvements.map((item, idx) => {
                                        const areaMatch = item.match(/Area:(.*?)\n/);
                                        const recommendationMatch = item.match(/Recommendation:(.*)/s);

                                        const area = areaMatch ? areaMatch[1].trim() : '';
                                        const recommendationText = recommendationMatch ? recommendationMatch[1].trim() : item;

                                        return (
                                            <div key={idx} className="p-4 bg-indigo-50 rounded-lg">
                                                {area && (
                                                    <p className="text-md font-semibold text-indigo-800 mb-1">
                                                        Area: <span className="font-normal text-gray-900">{area}</span>
                                                    </p>
                                                )}
                                                {recommendationText && (
                                                    <p className="text-md font-semibold text-indigo-800">
                                                        Recommendation: <span className="font-normal text-gray-900">{recommendationText}</span>
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Suggestions */}
                        {suggestions && suggestions.length > 0 && (
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Workout Suggestions</h3>
                                <div className="space-y-4">
                                    {suggestions.map((item, idx) => {
                                        const workoutMatch = item.match(/Workout:(.*?)\n/);
                                        const descriptionMatch = item.match(/Description:(.*)/s);

                                        const workout = workoutMatch ? workoutMatch[1].trim() : '';
                                        const descriptionText = descriptionMatch ? descriptionMatch[1].trim() : item;

                                        return (
                                            <div key={idx} className="p-4 bg-indigo-50 rounded-lg">
                                                {workout && (
                                                    <p className="text-md font-semibold text-indigo-800 mb-1">
                                                        Workout: <span className="font-normal text-gray-900">{workout}</span>
                                                    </p>
                                                )}
                                                {descriptionText && (
                                                    <p className="text-md font-semibold text-indigo-800">
                                                        Description: <span className="font-normal text-gray-900">{descriptionText}</span>
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}


                        {/* Safety */}
                        {safety && safety.length > 0 && (
                            <section className="mb-6">
                                <h3 className="text-xl font-semibold mb-2 text-indigo-700">Safety Tips</h3>
                                <ul className="list-disc list-inside text-gray-800 space-y-2">
                                    {safety.map((item, idx) => (
                                        <li key={idx} className="whitespace-pre-line">{item}</li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Close Button Bottom */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg mt-4"
                        >
                            Close
                        </button>
                    </div>

                </div>
        </motion.div>

    );
};

export default RecommendationModal;
