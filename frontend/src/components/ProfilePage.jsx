import React, { useState, useEffect } from 'react';
import ContributionGraph from './ContributionGraph';
import { getProjects } from '../services/api';

const ProfilePage = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const userProjects = await getProjects();
                setProjects(userProjects);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            }
        };

        fetchProjects();
    }, []);

    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        bio: 'Software developer and tech enthusiast. Passionate about open source and building cool things.',
        stats: {
            projects: projects.length,
            contributions: 142,
            followers: 78,
        },
        latestProject: projects.length > 0 ? { name: projects[0].title, link: `/roadmap/${projects[0].id}` } : { name: 'N/A', link: '#' },
        mostContributedProject: projects.length > 0 ? { name: projects[0].title, link: `/roadmap/${projects[0].id}` } : { name: 'N/A', link: '#' },
        mostUsedLanguage: 'JavaScript',
    };

    const contributions = [
        { date: '2024-01-01', count: 1 },
        { date: '2024-01-22', count: 2 },
        { date: '2024-01-30', count: 4 },
        { date: '2024-02-15', count: 3 },
        { date: '2024-03-05', count: 5 },
        { date: '2024-04-12', count: 2 },
    ];

    return (
        <div className="bg-gradient-to-b from-gray-900 to-rich-black text-white-smoke min-h-screen p-4 sm:p-8">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
                            <img src={user.avatar} alt="User Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 ring-4 ring-orange-500/70 shadow-md" />
                            <h1 className="text-3xl font-bold text-center text-white">{user.name}</h1>
                            <p className="text-gray-400 text-center mb-4">{user.email}</p>
                            <p className="text-center text-gray-300 mb-6 text-sm">{user.bio}</p>
                            <div className="flex justify-around mb-6 bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-500">{user.stats.projects}</p>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider">Projects</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-500">{user.stats.contributions}</p>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider">Contributions</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-500">{user.stats.followers}</p>
                                    <p className="text-gray-400 text-xs uppercase tracking-wider">Followers</p>
                                </div>
                            </div>
                            <a 
                                href={`${API_URL}/auth/github/login`}
                                className="block text-center w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                                Connect to GitHub
                            </a>
                            <div className="border-t border-gray-700/50 pt-4 mt-6">
                                <h3 className="text-lg font-semibold mb-3 text-white uppercase tracking-wider">Details</h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-400">Most Used Language:</span>
                                        <span className="font-bold bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md">{user.mostUsedLanguage}</span>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-400">Latest Project:</span>
                                        <a href={user.latestProject.link} className="font-bold text-orange-400 hover:text-orange-300 transition-colors duration-300">{user.latestProject.name}</a>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span className="text-gray-400">Most Contributed:</span>
                                        <a href={user.mostContributedProject.link} className="font-bold text-orange-400 hover:text-orange-300 transition-colors duration-300">{user.mostContributedProject.name}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contribution Graph and Projects */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
                            <h2 className="text-xl font-semibold mb-4 text-white uppercase tracking-wider">Contribution Matrix</h2>
                            <div className="bg-gray-900/50 p-4 rounded-lg">
                                <ContributionGraph contributions={contributions} />
                            </div>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/50">
                            <h2 className="text-xl font-semibold mb-4 text-white uppercase tracking-wider">Projects</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/30 hover:bg-gray-700/50 hover:border-orange-500/50 transition-all duration-300 transform hover:-translate-y-1">
                                        <h3 className="font-bold text-white">{project.title}</h3>
                                        <p className="text-gray-400 text-sm mt-1">{project.description || 'No description'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;