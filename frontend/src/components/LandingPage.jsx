import React from 'react';
import Navbar from "./Navbar.jsx";
import { Link } from 'react-router-dom'

const LandingPage = () => {
    return (<>
            <div className="bg-gradient-to-b from-rich-black to-[#071a2a]">
                {/* Hero Section */}
                <div className="max-w-screen-xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
                    <h1 className="font-k95 text-white-smoke text-4xl md:text-6xl mb-4 leading-tight">
                        Turn your Ideas Into Reality with <span className="text-orange-500">AI-Powered Guidance</span>
                    </h1>
                    <p className="font-josefin text-white-smoke/90 text-lg md:text-xl max-w-3xl mb-8">
                        Profectus helps students and developers refine project ideas with AI-generated questions, structured tasks, and goal tracking.
                    </p>
                    <Link to="/create-project" className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                        Get Started for Free
                    </Link>
                </div>

                {/* How It Works Section */}
                <div className="bg-[#01080e]/60 py-20">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <h2 className="font-k95 text-white-smoke text-3xl md:text-4xl text-center mb-16">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="font-josefin font-bold text-white-smoke text-xl mb-3">Describe Your Idea</h3>
                                <p className="font-josefin text-white-smoke/80">Input your project concept and let our AI understand your vision.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-josefin font-bold text-white-smoke text-xl mb-3">Get AI-Generated Questions</h3>
                                <p className="font-josefin text-white-smoke/80">Clarify and refine your project with smart suggestions.</p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="font-josefin font-bold text-white-smoke text-xl mb-3">Track Progress</h3>
                                <p className="font-josefin text-white-smoke/80">Use gamified streak tracking to stay motivated and achieve goals.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-20">
                    <div className="max-w-screen-xl mx-auto px-4">
                        <h2 className="font-k95 text-white-smoke text-3xl md:text-4xl text-center mb-16">Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#071a2a]/60 p-8 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-josefin font-bold text-white-smoke text-xl">AI-powered project ideation</h3>
                                </div>
                                <p className="font-josefin text-white-smoke/80 ml-16">Generate creative project ideas and get AI guidance to develop them fully.</p>
                            </div>
                            <div className="bg-[#071a2a]/60 p-8 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-josefin font-bold text-white-smoke text-xl">Gamified streak tracking</h3>
                                </div>
                                <p className="font-josefin text-white-smoke/80 ml-16">Stay motivated with visual progress tracking similar to GitHub contribution graphs.</p>
                            </div>
                            <div className="bg-[#071a2a]/60 p-8 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-josefin font-bold text-white-smoke text-xl">Custom refinement questions</h3>
                                </div>
                                <p className="font-josefin text-white-smoke/80 ml-16">Get intelligent questions that help clarify and improve your project concept.</p>
                            </div>
                            <div className="bg-[#071a2a]/60 p-8 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-josefin font-bold text-white-smoke text-xl">Personalized recommendations</h3>
                                </div>
                                <p className="font-josefin text-white-smoke/80 ml-16">Receive tailored suggestions based on your progress and project needs.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="py-16 bg-[#01080e]/80">
                    <div className="max-w-screen-xl mx-auto px-4 text-center">
                        <h2 className="font-k95 text-white-smoke text-2xl md:text-3xl mb-6">Ready to Start Your Project Journey?</h2>
                        <Link to="/create-project" className="bg-orange-500 hover:bg-orange-600 text-white-smoke font-josefin font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                            Create Your First Project
                        </Link>
                    </div>
                </div>
            </div>
        </>)
};

export default LandingPage;