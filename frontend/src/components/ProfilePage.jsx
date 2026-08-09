import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, FolderKanban, GitCommit, Users } from 'lucide-react';
import ContributionGraph from './ContributionGraph';
import { getProjects } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';

const ProfilePage = () => {
    const { user } = useAuth();

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

    const profile = {
        name: user?.name || user?.username || 'No Name',
        email: user?.email || 'No Email',
        avatar: user?.avatar_url || 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
        bio: user?.bio || 'No bio provided. Sync your GitHub bio!',
        stats: {
            projects: projects.length,
            contributions: user?.contributions || 0,
            followers: user?.followers || 0,
        },
        latestProject: projects.length > 0
            ? { name: projects[0].title, link: `/roadmap/${projects[0].id}` }
            : { name: 'N/A', link: '#' },
        mostUsedLanguage: user?.most_used_language || 'Unknown',
    };

    // Sample data shown until live GitHub activity sync is available.
    const contributions = [
        { date: '2024-01-01', count: 1 },
        { date: '2024-01-22', count: 2 },
        { date: '2024-01-30', count: 4 },
        { date: '2024-02-15', count: 3 },
        { date: '2024-03-05', count: 5 },
        { date: '2024-04-12', count: 2 },
    ];

    return (
        <div className="app-shell text-white-smoke min-h-[calc(100vh-73px)] p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1"
                    >
                        <Card hover={false} className="p-6">
                            <img src={profile.avatar} alt="User Avatar" className="w-28 h-28 rounded-full mx-auto mb-4 ring-4 ring-orange-500/40 shadow-md" />
                            <h1 className="text-2xl font-k95 text-center text-white-smoke">{profile.name}</h1>
                            <p className="text-white-smoke/50 text-center mb-4 font-josefin text-sm">{profile.email}</p>
                            <p className="text-center text-white-smoke/70 mb-6 text-sm font-josefin">{profile.bio}</p>

                            <div className="grid grid-cols-3 gap-2 mb-6 bg-rich-black/50 rounded-lg p-4 border border-white-smoke/8">
                                <div className="text-center">
                                    <FolderKanban size={16} className="text-orange-500 mx-auto mb-1" />
                                    <p className="text-xl font-bold font-k95 text-white-smoke">{profile.stats.projects}</p>
                                    <p className="text-white-smoke/50 text-[10px] uppercase tracking-wider font-josefin">Projects</p>
                                </div>
                                <div className="text-center">
                                    <GitCommit size={16} className="text-orange-500 mx-auto mb-1" />
                                    <p className="text-xl font-bold font-k95 text-white-smoke">{profile.stats.contributions}</p>
                                    <p className="text-white-smoke/50 text-[10px] uppercase tracking-wider font-josefin">Contributions</p>
                                </div>
                                <div className="text-center">
                                    <Users size={16} className="text-orange-500 mx-auto mb-1" />
                                    <p className="text-xl font-bold font-k95 text-white-smoke">{profile.stats.followers}</p>
                                    <p className="text-white-smoke/50 text-[10px] uppercase tracking-wider font-josefin">Followers</p>
                                </div>
                            </div>

                            <div className="border-t border-white-smoke/10 pt-4">
                                <h3 className="text-sm font-semibold mb-3 text-white-smoke/70 uppercase tracking-wider font-josefin flex items-center gap-2">
                                    <Code2 size={14} />
                                    Details
                                </h3>
                                <ul className="space-y-3 text-sm font-josefin">
                                    <li className="flex justify-between items-center gap-2">
                                        <span className="text-white-smoke/50">Most Used Language</span>
                                        <span className="font-bold bg-orange-500/15 text-orange-300 px-2 py-1 rounded-md">{profile.mostUsedLanguage}</span>
                                    </li>
                                    <li className="flex justify-between items-center gap-2">
                                        <span className="text-white-smoke/50">Latest Project</span>
                                        <a href={profile.latestProject.link} className="font-bold text-orange-400 hover:text-orange-300 transition-colors truncate max-w-[140px]">
                                            {profile.latestProject.name}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right Column: Contribution Graph and Projects */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <Card hover={false} className="p-6">
                            <div className="flex items-baseline justify-between mb-4 flex-wrap gap-1">
                                <h2 className="text-lg font-semibold text-white-smoke uppercase tracking-wider font-josefin">Contribution Matrix</h2>
                                <span className="text-xs text-white-smoke/40 font-josefin">Sample data — live sync coming soon</span>
                            </div>
                            <div className="bg-rich-black/50 p-4 rounded-lg border border-white-smoke/8">
                                <ContributionGraph contributions={contributions} />
                            </div>
                        </Card>

                        <Card hover={false} className="p-6">
                            <h2 className="text-lg font-semibold mb-4 text-white-smoke uppercase tracking-wider font-josefin">Projects</h2>
                            {projects.length === 0 ? (
                                <p className="text-white-smoke/50 text-sm font-josefin">No projects yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {projects.map((project) => (
                                        <a
                                            key={project.id}
                                            href={`/roadmap/${project.id}`}
                                            className="block bg-rich-black/50 p-4 rounded-lg border border-white-smoke/8 hover:bg-rich-black/80 hover:border-orange-500/30 transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            <h3 className="font-bold text-white-smoke font-josefin">{project.title}</h3>
                                            <p className="text-white-smoke/50 text-sm mt-1 font-josefin line-clamp-2">{project.description || 'No description'}</p>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
