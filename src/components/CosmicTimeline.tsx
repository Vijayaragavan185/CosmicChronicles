import React, { useState, useEffect, useRef } from 'react';
import { Clock, Star, Telescope, Rocket, Atom, Globe, Zap, Eye, Orbit, ArrowUp, Grid, List, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'cosmic' | 'stellar' | 'planetary' | 'discovery' | 'mission' | 'technology';
  image: string;
  yearAgo?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    title: 'Big Bang',
    date: '~13.8 Billion Years Ago',
    yearAgo: '13.8 BYA',
    description: 'The origin of space, time, matter, and energy.',
    type: 'cosmic',
    image: 'https://media.istockphoto.com/id/177339031/photo/space-warp-travel-trough-universe.jpg?s=612x612&w=0&k=20&c=C6U7SHZwUFLxkB-LGPLCdCsaOMmyBodlrBm4lzjT44o='
  },
  {
    id: '2',
    title: 'First Stars Form',
    date: '~13.6 Billion Years Ago',
    yearAgo: '13.6 BYA',
    description: 'Pop III stars begin lighting up the early universe.',
    type: 'stellar',
    image: 'https://cdn.mos.cms.futurecdn.net/WLRC3RrdWxXdzZExS63NN8.jpg'
  },
  {
    id: '3',
    title: 'First Galaxies Form',
    date: '~13.2 Billion Years Ago',
    yearAgo: '13.2 BYA',
    description: 'Clusters of stars and gas evolve into baby galaxies.',
    type: 'cosmic',
    image: 'https://cdn.pixabay.com/photo/2017/08/15/08/23/stars-2643089_1280.jpg'
  },
  {
    id: '4',
    title: 'Formation of the Sun',
    date: '~4.6 Billion Years Ago',
    yearAgo: '4.6 BYA',
    description: 'Our solar system starts forming from a molecular cloud.',
    type: 'stellar',
    image: 'https://c4.wallpaperflare.com/wallpaper/865/177/310/beautiful-epic-sun-space-stars-hd-art-wallpaper-thumb.jpg'
  },
  {
    id: '5',
    title: 'Earth is Born',
    date: '~4.5 Billion Years Ago',
    yearAgo: '4.5 BYA',
    description: 'The third rock from the Sun forms.',
    type: 'planetary',
    image: 'https://i.pinimg.com/736x/b5/f8/b6/b5f8b61c1a105fd073cceb65813a8e17.jpg'
  },
  {
    id: '6',
    title: 'Moon Forms',
    date: '~4.4 Billion Years Ago',
    yearAgo: '4.4 BYA',
    description: 'Possibly from a Mars-sized body colliding with Earth.',
    type: 'planetary',
    image: 'https://t4.ftcdn.net/jpg/03/55/76/73/360_F_355767306_DRQv83u3yHUCANIBfOMCr5fv26jeKg6N.jpg'
  },
  {
    id: '7',
    title: 'Earliest Life on Earth',
    date: '~3.5 Billion Years Ago',
    yearAgo: '3.5 BYA',
    description: 'Microbial life starts showing up in ancient oceans.',
    type: 'planetary',
    image: 'https://i0.wp.com/criticalposthumanism.net/wp-content/uploads/2020/06/bactries12_thumb.jpg?fit=640%2C406&ssl=1'
  },
  {
    id: '8',
    title: 'Galileo Builds the First Telescope',
    date: '1609',
    description: 'He observes craters on the Moon and Jupiter\'s moons.',
    type: 'discovery',
    image: 'https://elpopular.cronosmedia.glr.pe/original/2021/10/29/617c3a7b8a3fc6446374d65c.jpg'
  },
  {
    id: '9',
    title: 'Newton Publishes Principia',
    date: '1687',
    description: 'Introduces universal gravity and laws of motion.',
    type: 'discovery',
    image: 'https://media.licdn.com/dms/image/v2/D5612AQFNPpd-b-cyIg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1693343972322?e=2147483647&v=beta&t=t8DydBAUHY74SH3bJCNFZXJRM5rY5SqC1EsNOcSShRY'
  },
  {
    id: '10',
    title: 'Einstein\'s General Relativity',
    date: '1916',
    description: 'Revolutionizes how we understand gravity.',
    type: 'discovery',
    image: 'https://d.newsweek.com/en/full/2519108/artists-impression-earths-gravity-well.jpg?w=1200&f=125cdc3a961c91e06148c8037f610883'
  },
  {
    id: '11',
    title: 'Hubble Discovers Universe Expansion',
    date: '1929',
    description: 'Galaxies are moving away — the universe is growing.',
    type: 'discovery',
    image: 'https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2024/09/Hubble-Telescope.jpeg?size=*:900'
  },
  {
    id: '12',
    title: 'Apollo 11 Moon Landing',
    date: '1969',
    description: 'First humans walk on the Moon. Iconic.',
    type: 'mission',
    image: 'https://www.catholicherald.com/wp-content/uploads/2022/01/CROP_LR_CNS_moon-landing.jpg.webp'
  },
  {
    id: '13',
    title: 'Hubble Space Telescope Launch',
    date: '1990',
    description: 'It changes everything. Deep space becomes visible.',
    type: 'technology',
    image: 'https://images.theconversation.com/files/78266/original/image-20150416-5606-1e4tgwi.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=1356&h=668&fit=crop'
  },
  {
    id: '14',
    title: 'Cassini Reaches Saturn',
    date: '2004',
    description: 'Sends stunning images and data from Saturn\'s system.',
    type: 'mission',
    image: 'https://i.ytimg.com/vi/ij2q3vkHKaA/maxresdefault.jpg'
  },
  {
    id: '15',
    title: 'LIGO Detects Gravitational Waves',
    date: '2015',
    description: 'Confirms Einstein\'s theory 100 years later.',
    type: 'discovery',
    image: 'https://www.ligo.caltech.edu/system/news_items/images/53/page/Virgo_aerial_view_01.jpg?1506530275'
  },
  {
    id: '16',
    title: 'First Image of a Black Hole',
    date: '2019',
    description: 'Event Horizon Telescope captures M87\'s shadow.',
    type: 'discovery',
    image: 'https://cdn.eso.org/images/screen/eso1907a.jpg'
  },
  {
    id: '17',
    title: 'James Webb Space Telescope Launch',
    date: '2021',
    description: 'Peeks deep into the early universe, stunning clarity.',
    type: 'technology',
    image: 'https://i.redd.it/8wsol9821zz71.jpg'
  },
  {
    id: '18',
    title: 'Artemis I Launch (NASA)',
    date: '2024',
    description: 'Marks return to Moon missions, prep for human return.',
    type: 'mission',
    image: 'https://www.nasa.gov/wp-content/uploads/2022/11/nhq202211160203.jpg'
  },
  {
    id: '19',
    title: 'Planned Artemis II (Crewed Lunar Flyby)',
    date: '2025',
    description: 'First crewed flight beyond low Earth orbit since Apollo.',
    type: 'mission',
    image: 'https://www.nasa.gov/wp-content/uploads/2023/05/artemis-ii-crew-for-advisory.jpg'
  }
];

export const CosmicTimeline: React.FC = () => {
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [overviewView, setOverviewView] = useState<'grid' | 'table'>('grid');
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress within the container
        const progress = Math.max(0, Math.min(1, -rect.top / (containerHeight - viewportHeight)));
        setScrollProgress(progress);
        
        // Show back to top button when scrolled down
        setShowBackToTop(window.scrollY > 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleEvents(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    const eventElements = document.querySelectorAll('[data-timeline-event]');
    eventElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'cosmic': return <Atom className="w-6 h-6" />;
      case 'stellar': return <Star className="w-6 h-6" />;
      case 'planetary': return <Globe className="w-6 h-6" />;
      case 'discovery': return <Eye className="w-6 h-6" />;
      case 'mission': return <Rocket className="w-6 h-6" />;
      case 'technology': return <Telescope className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'cosmic': return 'from-purple-600 to-indigo-600';
      case 'stellar': return 'from-yellow-500 to-orange-600';
      case 'planetary': return 'from-blue-500 to-cyan-600';
      case 'discovery': return 'from-green-500 to-emerald-600';
      case 'mission': return 'from-red-500 to-pink-600';
      case 'technology': return 'from-gray-500 to-slate-600';
      default: return 'from-purple-600 to-blue-600';
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'cosmic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'stellar': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'planetary': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'discovery': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'mission': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'technology': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
          <Clock className="w-8 h-8 text-purple-400" />
          <span>Cosmic Timeline</span>
          <Star className="w-8 h-8 text-blue-400" />
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          From the Big Bang to the future of space exploration
        </p>
        
        {/* Progress indicator */}
        <div className="max-w-md mx-auto">
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Journey Progress: {Math.round(scrollProgress * 100)}%
          </p>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-600 via-blue-600 to-cyan-600 h-full rounded-full">
          {/* Animated pulse effect */}
          <div className="absolute top-0 w-3 h-3 bg-purple-400 rounded-full -left-1 animate-pulse"></div>
          <div 
            className="absolute w-3 h-3 bg-blue-400 rounded-full -left-1 transition-all duration-1000"
            style={{ top: `${scrollProgress * 100}%` }}
          ></div>
        </div>

        {/* Timeline Events */}
        <div className="space-y-16">
          {timelineEvents.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isVisible = visibleEvents.has(event.id);
            
            return (
              <div
                key={event.id}
                id={event.id}
                data-timeline-event
                className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
                  } bg-gradient-to-r ${getEventColor(event.type)} shadow-lg`}>
                    <div className="text-white">
                      {getEventIcon(event.type)}
                    </div>
                  </div>
                  
                  {/* Year label */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                      {event.yearAgo || event.date}
                    </div>
                  </div>
                </div>

                {/* Event Card */}
                <div className={`w-full max-w-md transition-all duration-700 delay-200 ${
                  isVisible 
                    ? 'opacity-100 translate-x-0' 
                    : `opacity-0 ${isLeft ? '-translate-x-16' : 'translate-x-16'}`
                } ${isLeft ? 'mr-8' : 'ml-8'}`}>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-300 group">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Type badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r ${getEventColor(event.type)}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                      </div>
                      
                      {/* Date overlay */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm font-medium">
                          {event.date}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline End */}
        <div className="flex justify-center mt-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Orbit className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">The Journey Continues</h3>
            <p className="text-gray-400">Exploring the infinite cosmos ahead...</p>
          </div>
        </div>
      </div>

      {/* Timeline Overview Section */}
      <div className="mt-24 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-indigo-900/30 backdrop-blur-md border border-white/20 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <Calendar className="w-7 h-7 text-purple-400" />
            <span>Complete Timeline Overview</span>
            <Grid className="w-7 h-7 text-blue-400" />
          </h3>
          <p className="text-gray-300 text-lg mb-6">
            View all cosmic events at a glance
          </p>
          
          {/* View Toggle */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <button
              onClick={() => setOverviewView('grid')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                overviewView === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setOverviewView('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                overviewView === 'table'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Table View</span>
            </button>
          </div>
        </div>

        {/* Grid View */}
        {overviewView === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {timelineEvents.map((event) => (
              <div
                key={`overview-${event.id}`}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm group-hover:text-blue-200 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-gray-400 text-xs">{event.yearAgo || event.date}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed mb-3">
                  {event.description}
                </p>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getEventBadgeColor(event.type)}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {overviewView === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-4 text-white font-semibold">Event</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {timelineEvents.map((event, index) => (
                  <tr
                    key={`table-${event.id}`}
                    className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                      index % 2 === 0 ? 'bg-white/2' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getEventColor(event.type)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        <span className="text-white font-medium">{event.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                      {event.yearAgo || event.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getEventBadgeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 text-sm">
                      {event.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back to Top Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTop}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 shadow-lg"
          >
            <ArrowUp className="w-5 h-5" />
            <span>Back to Top</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mt-16">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">13.8B</div>
          <div className="text-gray-400">Years Since Big Bang</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">19</div>
          <div className="text-gray-400">Major Milestones</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">416</div>
          <div className="text-gray-400">Years of Modern Astronomy</div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">∞</div>
          <div className="text-gray-400">Discoveries Ahead</div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};