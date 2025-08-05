import React, { useState } from 'react';
import { Play, BookOpen, Rocket, Globe, Users, ExternalLink, Monitor, FileText } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: 'historic' | 'mission' | 'science';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  manualContent?: {
    overview: string;
    keyPoints: string[];
    technicalDetails: string[];
    significance: string;
  };
}

const educationalVideos: Video[] = [
  {
    id: '1',
    title: 'Neil Armstrong\'s Historic Moon Landing',
    description: 'Experience the historic moment when Neil Armstrong became the first human to set foot on the Moon during Apollo 11 mission. This authentic footage captures one of humanity\'s greatest achievements.',
    youtubeId: 'cwZb2mqId0A',
    category: 'historic',
    duration: '3:21',
    difficulty: 'Beginner',
    manualContent: {
      overview: 'On July 20, 1969, Neil Armstrong became the first human to step foot on the Moon during NASA\'s Apollo 11 mission. This historic moment was watched by an estimated 650 million people worldwide and marked humanity\'s greatest achievement in space exploration.',
      keyPoints: [
        'Apollo 11 launched on July 16, 1969, from Kennedy Space Center',
        'The lunar module "Eagle" separated from command module "Columbia"',
        'Armstrong and Aldrin landed in the Sea of Tranquility',
        'Armstrong\'s famous words: "That\'s one small step for man, one giant leap for mankind"',
        'They spent 21.5 hours on the lunar surface',
        'Collected 47.5 pounds of lunar samples for scientific analysis'
      ],
      technicalDetails: [
        'Saturn V rocket: 363 feet tall, weighing 6.2 million pounds',
        'Command Module: Protected crew during Earth re-entry',
        'Lunar Module: Two-stage spacecraft designed for Moon landing',
        'Mission duration: 8 days, 3 hours, 18 minutes, 35 seconds',
        'Landing site coordinates: 0°40\'27"N 23°28\'23"E',
        'Surface EVA duration: 2 hours, 31 minutes, 40 seconds'
      ],
      significance: 'The Apollo 11 mission proved that human space exploration was possible and demonstrated American technological superiority during the Cold War. It inspired generations of scientists, engineers, and explorers, and the scientific samples collected continue to provide insights into the Moon\'s formation and the early solar system.'
    }
  },
  {
    id: '2',
    title: 'Chandrayaan Mission: 3D Visualization',
    description: 'Explore how India\'s Chandrayaan lunar mission works through detailed 3D animations. Understand the complex orbital mechanics and mission phases that made this achievement possible.',
    youtubeId: '1ix8DufA3tQ',
    category: 'mission',
    duration: '8:45',
    difficulty: 'Intermediate',
    manualContent: {
      overview: 'Chandrayaan (Sanskrit for "Moon Vehicle") represents India\'s ambitious lunar exploration program. The mission series demonstrates advanced orbital mechanics, precision navigation, and cost-effective space technology, establishing India as a major space-faring nation.',
      keyPoints: [
        'Chandrayaan-1 (2008): India\'s first lunar probe, discovered water on the Moon',
        'Chandrayaan-2 (2019): Included orbiter, lander, and rover components',
        'Chandrayaan-3 (2023): Successful soft landing near Moon\'s south pole',
        'Cost-effective missions: Chandrayaan-1 cost only $54 million',
        'International collaboration with NASA, ESA, and other agencies',
        'Advanced scientific instruments for lunar surface and subsurface analysis'
      ],
      technicalDetails: [
        'Launch vehicle: PSLV (Polar Satellite Launch Vehicle)',
        'Trans-lunar injection: Complex multi-phase orbital maneuvers',
        'Lunar orbit insertion: Precision braking to achieve stable orbit',
        'Communication: Deep Space Network for mission control',
        'Power systems: Solar panels and radioisotope thermoelectric generators',
        'Navigation: Autonomous guidance and hazard avoidance systems'
      ],
      significance: 'The Chandrayaan missions have revolutionized our understanding of lunar water distribution, especially at the poles. They\'ve demonstrated that space exploration can be achieved cost-effectively and have inspired developing nations to pursue their own space programs. The discovery of water ice has implications for future human lunar settlements.'
    }
  },
  {
    id: '3',
    title: 'Zero Gravity Life: Astronauts in Space',
    description: 'Discover what life is like for astronauts in zero gravity aboard spacecraft. See how they eat, sleep, work, and conduct experiments in the unique environment of space.',
    youtubeId: 'hPC9R_HgNXY',
    category: 'science',
    duration: '12:30',
    difficulty: 'Beginner',
    manualContent: {
      overview: 'Life in microgravity presents unique challenges and opportunities for astronauts aboard the International Space Station. Every aspect of daily life must be reimagined when there is no "up" or "down," requiring innovative solutions for basic human needs and scientific research.',
      keyPoints: [
        'Microgravity affects every bodily function and daily activity',
        'Special techniques required for eating, drinking, and personal hygiene',
        'Sleep requires restraints to prevent floating around the cabin',
        'Exercise is crucial to prevent muscle atrophy and bone loss',
        'Scientific experiments take advantage of unique microgravity conditions',
        'Psychological adaptation to confined space and isolation'
      ],
      technicalDetails: [
        'Microgravity environment: 10⁻⁶ g (one millionth of Earth\'s gravity)',
        'Life support systems: Oxygen generation, CO₂ scrubbing, water recycling',
        'Food systems: Thermostabilized, rehydratable, and fresh foods',
        'Waste management: Vacuum-based systems for liquid and solid waste',
        'Exercise equipment: Treadmill, cycle ergometer, resistance device',
        'Environmental controls: Temperature, humidity, and air circulation'
      ],
      significance: 'Understanding how humans adapt to microgravity is crucial for future long-duration missions to Mars and beyond. The research conducted in space has led to medical breakthroughs on Earth, including treatments for osteoporosis, muscle wasting diseases, and cardiovascular conditions. This knowledge is essential for planning sustainable human presence in space.'
    }
  }
];

export const SpaceEducation: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showManual, setShowManual] = useState(false);

  const filteredVideos = activeCategory === 'all' 
    ? educationalVideos 
    : educationalVideos.filter(video => video.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'historic': return <BookOpen className="w-5 h-5" />;
      case 'mission': return <Rocket className="w-5 h-5" />;
      case 'science': return <Globe className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'historic': return 'from-amber-600 to-orange-600';
      case 'mission': return 'from-blue-600 to-cyan-600';
      case 'science': return 'from-green-600 to-emerald-600';
      default: return 'from-purple-600 to-blue-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Play className="w-8 h-8 text-purple-400" />
          <span>Space Education Center</span>
          <BookOpen className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg">
          Learn from authentic space missions and scientific discoveries
        </p>
      </div>

      {/* Compact Category Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2 mb-8">
        {[
          { id: 'all', label: 'All', icon: Users, color: 'from-purple-600 to-blue-600' },
          { id: 'historic', label: 'Historic', icon: BookOpen, color: 'from-amber-600 to-orange-600' },
          { id: 'mission', label: 'Missions', icon: Rocket, color: 'from-blue-600 to-cyan-600' },
          { id: 'science', label: 'Science', icon: Globe, color: 'from-green-600 to-emerald-600' }
        ].map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Video Player Section */}
      {selectedVideo && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(selectedVideo.difficulty)}`}>
                  {selectedVideo.difficulty}
                </span>
                <span className="text-gray-400">{selectedVideo.duration}</span>
                <div className="flex items-center space-x-1">
                  {getCategoryIcon(selectedVideo.category)}
                  <span className="text-gray-400 capitalize">{selectedVideo.category}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowManual(!showManual)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  showManual ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Manual</span>
              </button>
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className={`${showManual ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <p className="text-gray-300 leading-relaxed">
                {selectedVideo.description}
              </p>
            </div>

            {/* Manual Content */}
            {showManual && selectedVideo.manualContent && (
              <div className="lg:col-span-1 space-y-4 max-h-96 overflow-y-auto">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <span>Overview</span>
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedVideo.manualContent.overview}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Key Points</h4>
                  <ul className="space-y-2">
                    {selectedVideo.manualContent.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300 text-sm">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Technical Details</h4>
                  <ul className="space-y-2">
                    {selectedVideo.manualContent.technicalDetails.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300 text-sm">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Significance</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedVideo.manualContent.significance}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
          >
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(video.category)} rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300">
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-black">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <div className={`p-2 bg-gradient-to-r ${getCategoryColor(video.category)} rounded-lg`}>
                      {getCategoryIcon(video.category)}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-sm">
                    {video.duration}
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Manual</span>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {video.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(video.difficulty)}`}>
                      {video.difficulty}
                    </span>
                    
                    <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                      <span className="text-sm">Watch now →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span>Learning Objectives</span>
          </h4>
          <div className="space-y-3 text-gray-300 text-sm">
            <div>
              <strong className="text-amber-400">Historic Missions:</strong> Understand the significance of landmark space achievements and their impact on humanity.
            </div>
            <div>
              <strong className="text-blue-400">Mission Operations:</strong> Learn about the complex engineering and planning behind successful space missions.
            </div>
            <div>
              <strong className="text-green-400">Space Science:</strong> Discover the unique conditions of space and how they affect human physiology and technology.
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <span>Featured Content</span>
          </h4>
          <div className="space-y-3 text-gray-300 text-sm">
            <div>
              <strong className="text-purple-400">Authentic Footage:</strong> Real NASA and space agency recordings provide genuine insights into space exploration.
            </div>
            <div>
              <strong className="text-cyan-400">3D Visualizations:</strong> Complex orbital mechanics and mission phases explained through detailed animations.
            </div>
            <div>
              <strong className="text-yellow-400">Educational Manuals:</strong> Comprehensive guides with technical details, key points, and historical significance.
            </div>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <ExternalLink className="w-5 h-5 text-purple-400" />
          <span>Additional Resources</span>
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="https://www.nasa.gov/audience/forstudents/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>NASA Student Resources</span>
          </a>
          <a
            href="https://www.esa.int/Education"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>ESA Education</span>
          </a>
          <a
            href="https://www.isro.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>ISRO Official</span>
          </a>
        </div>
      </div>
    </div>
  );
};