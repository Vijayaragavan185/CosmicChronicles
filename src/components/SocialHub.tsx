import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageSquare, Share2, Camera, Star, Trophy, MapPin, Clock, Send } from 'lucide-react';

interface SocialHubProps {
  selectedDate: Date;
}

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: number;
    location: string;
  };
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  type: 'observation' | 'photo' | 'question' | 'achievement';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  participants: number;
  deadline: Date;
  completed: boolean;
}

const samplePosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar: '👩‍🚀',
      level: 15,
      location: 'California, USA'
    },
    content: 'Just captured an amazing shot of Jupiter and its moons through my telescope! The Great Red Spot is clearly visible tonight. Perfect seeing conditions! 🔭✨',
    image: 'https://images.pexels.com/photos/87009/earth-soil-creep-moon-lunar-surface-87009.jpeg?auto=compress&cs=tinysrgb&w=400',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 47,
    comments: 12,
    shares: 8,
    liked: false,
    type: 'photo'
  },
  {
    id: '2',
    user: {
      name: 'Alex Rodriguez',
      avatar: '🧑‍🔬',
      level: 22,
      location: 'Texas, USA'
    },
    content: 'Completed the "Messier Marathon" challenge! Observed 45 deep-sky objects in one night. The Orion Nebula was absolutely breathtaking! 🌌',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 89,
    comments: 23,
    shares: 15,
    liked: true,
    type: 'achievement'
  },
  {
    id: '3',
    user: {
      name: 'Emma Thompson',
      avatar: '👩‍🎓',
      level: 8,
      location: 'London, UK'
    },
    content: 'Can anyone help identify this constellation I photographed last night? It was visible around 10 PM looking northeast. New to stargazing and loving every moment! 🌟',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 34,
    comments: 18,
    shares: 3,
    liked: false,
    type: 'question'
  },
  {
    id: '4',
    user: {
      name: 'Dr. Michael Park',
      avatar: '👨‍🔬',
      level: 35,
      location: 'Seoul, South Korea'
    },
    content: 'Witnessed a spectacular meteor shower tonight! Counted over 60 meteors in an hour. The Perseids are putting on quite a show this year. Don\'t miss it! ☄️',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: 156,
    comments: 42,
    shares: 67,
    liked: true,
    type: 'observation'
  }
];

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Lunar Phase Master',
    description: 'Observe and photograph all 8 phases of the Moon',
    difficulty: 'Medium',
    points: 500,
    participants: 1247,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    completed: false
  },
  {
    id: '2',
    title: 'Planet Hunter',
    description: 'Spot all visible planets in one night',
    difficulty: 'Hard',
    points: 1000,
    participants: 892,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    completed: false
  },
  {
    id: '3',
    title: 'Constellation Explorer',
    description: 'Identify 20 different constellations',
    difficulty: 'Easy',
    points: 250,
    participants: 2156,
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    completed: true
  }
];

export const SocialHub: React.FC<SocialHubProps> = ({ selectedDate }) => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'leaderboard'>('feed');

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
    alert('Post shared to your timeline!');
  };

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: '🚀',
        level: 12,
        location: 'Your Location'
      },
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      type: 'observation'
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const leaderboardData = [
    { rank: 1, name: 'Dr. Michael Park', points: 15420, avatar: '👨‍🔬', level: 35 },
    { rank: 2, name: 'Sarah Chen', points: 12890, avatar: '👩‍🚀', level: 28 },
    { rank: 3, name: 'Alex Rodriguez', points: 11250, avatar: '🧑‍🔬', level: 22 },
    { rank: 4, name: 'Emma Thompson', points: 8930, avatar: '👩‍🎓', level: 18 },
    { rank: 5, name: 'You', points: 7650, avatar: '🚀', level: 12 }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Users className="w-8 h-8 text-purple-400" />
          <span>Cosmic Community</span>
          <Star className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Connect with fellow stargazers, share discoveries, and explore together
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeTab === 'feed'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Community Feed</span>
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeTab === 'challenges'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Challenges</span>
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
            activeTab === 'leaderboard'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <Star className="w-5 h-5" />
          <span>Leaderboard</span>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Share Your Cosmic Discovery</span>
            </h3>
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What did you observe in the cosmos today?"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm hover:bg-blue-500/30 transition-colors">
                    📷 Photo
                  </button>
                  <button className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm hover:bg-green-500/30 transition-colors">
                    📍 Location
                  </button>
                  <button className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm hover:bg-purple-500/30 transition-colors">
                    🏆 Achievement
                  </button>
                </div>
                <button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{post.user.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-white">{post.user.name}</h4>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        Level {post.user.level}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{post.user.location}</span>
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                    
                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={post.image} 
                          alt="User shared content"
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button
                          onClick={() => handleShare(post.id)}
                          className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimeAgo(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Astronomy Challenges</h3>
            <p className="text-gray-300">Complete challenges to earn points and level up!</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{challenge.title}</h4>
                    <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
                  </div>
                  {challenge.completed && (
                    <div className="text-green-400">
                      <Trophy className="w-6 h-6" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-purple-400 font-semibold">{challenge.points} pts</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{challenge.participants} participants</span>
                  <span>Ends {challenge.deadline.toLocaleDateString()}</span>
                </div>
                
                <button
                  disabled={challenge.completed}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    challenge.completed
                      ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                  }`}
                >
                  {challenge.completed ? 'Completed!' : 'Join Challenge'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Global Leaderboard</h3>
            <p className="text-gray-300">Top astronomers in our community</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            <div className="space-y-4">
              {leaderboardData.map((user) => (
                <div key={user.rank} className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                  user.name === 'You' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5 hover:bg-white/10'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    user.rank === 1 ? 'bg-yellow-500 text-black' :
                    user.rank === 2 ? 'bg-gray-400 text-black' :
                    user.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-white/20 text-white'
                  }`}>
                    {user.rank}
                  </div>
                  <div className="text-2xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        Level {user.level}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{user.points.toLocaleString()} points</p>
                  </div>
                  {user.rank <= 3 && (
                    <div className="text-2xl">
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};