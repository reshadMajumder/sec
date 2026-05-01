import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus, 
  MoreHorizontal, 
  Send,
  User,
  Search
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface Post {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  category: 'QUERY' | 'INFO' | 'OPPORTUNITY';
  avatar?: string;
}

const DUMMY_POSTS: Post[] = [
  {
    id: 'post-1',
    author: 'Rakibul Islam',
    role: 'ALUMNI / SENIOR ARCHITECT',
    content: "Has anyone tried the new React 19 concurrent features for high-performance canvas rendering? I'm seeing some interesting benchmarks compared to previous versions. Would love to discuss optimization strategies for DIU SEC projects.",
    timestamp: '2H AGO',
    likes: 24,
    category: 'QUERY',
    comments: [
      { id: 'c1', author: 'Safa Ahmed', content: 'The transitions API looks promising for our dashboard projects.', timestamp: '1H AGO' },
      { id: 'c2', author: 'Tanvir Hossain', content: 'We should run a workshop on this next Friday at DSC.', timestamp: '30M AGO' }
    ]
  },
  {
    id: 'post-2',
    author: 'Software Engineering Club',
    role: 'OFFICIAL_BOT',
    content: "ANNOUNCEMENT: The 'Next-Gen Architect' hackathon registration opens in 24 hours. Prepare your teams. Theme: Sustainable Smart City Solutions for Daffodil Smart City.",
    timestamp: '5H AGO',
    likes: 156,
    category: 'INFO',
    comments: []
  },
  {
    id: 'post-3',
    author: 'Mehedi Hasan',
    role: 'MEMBER / L3',
    content: "Internship opportunity at DIU IT Labs for 3rd-year students. Required skills: Python, Fast API, and basic knowledge of cloud architecture. Remote work available.",
    timestamp: '1D AGO',
    likes: 42,
    category: 'OPPORTUNITY',
    comments: [
      { id: 'c3', author: 'Jahidul Hassan', content: 'What is the deadline for application?', timestamp: '5H AGO' }
    ]
  }
];

export function CommunityPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(DUMMY_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'QUERY' | 'INFO'>('ALL');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || post.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'Current User',
      role: 'SYSTEM_MEMBER',
      content: newPostContent,
      timestamp: 'JUST NOW',
      likes: 0,
      comments: [],
      category: 'QUERY'
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="min-h-screen bg-brand-off-white text-brand-black selection:bg-black selection:text-white pb-32">
      {/* Search Header */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] p-4 md:p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-4 bg-white/80 backdrop-blur-md border border-black/5 px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">EXIT_COMMUNITY</span>
          </button>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH_THE_BRAINSTORM"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-md border border-black/5 pl-12 pr-4 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-black/10 transition-all shadow-sm"
            />
          </div>

          <button className="w-12 h-12 bg-white/80 backdrop-blur-md border border-black/5 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
            <User size={18} />
          </button>
        </div>
      </nav>

      {/* Main Feed */}
      <main className="max-w-3xl mx-auto pt-32 px-6">
        <header className="mb-12">
          <span className="text-[10px] font-mono tracking-[0.6em] opacity-40 uppercase block mb-4">DAFFODIL_SMART_CITY_FEED</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">COMMUNITY_HUB.</h1>
        </header>

        {/* Create Post */}
        <div className="bg-white border border-black/10 p-6 md:p-8 mb-12 shadow-[10px_10px_0px_rgba(0,0,0,0.05)] rounded-2xl">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-black/[0.03] rounded-full flex items-center justify-center flex-shrink-0">
              <Plus size={20} className="opacity-20" />
            </div>
            <div className="flex-1 space-y-4">
              <textarea 
                placeholder="WHAT'S ON YOUR MIND, ARCHITECT?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-lg font-bold placeholder:opacity-20 uppercase tracking-tight resize-none min-h-[100px]"
              />
              <div className="flex justify-between items-center pt-4 border-t border-black/5">
                <div className="flex gap-4">
                  <span className="text-[9px] font-black opacity-30 cursor-pointer hover:opacity-100 transition-opacity">#QUERY</span>
                  <span className="text-[9px] font-black opacity-30 cursor-pointer hover:opacity-100 transition-opacity">#INFO</span>
                  <span className="text-[9px] font-black opacity-30 cursor-pointer hover:opacity-100 transition-opacity">#DEV</span>
                </div>
                <button 
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="px-8 py-3 bg-brand-black text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-20 disabled:scale-100"
                >
                  BROADCAST_NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {(['ALL', 'QUERY', 'INFO'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 border-2 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap rounded-full ${
                activeTab === tab 
                ? 'bg-brand-black text-white border-brand-black shadow-lg translate-y-[-2px]' 
                : 'bg-transparent text-black/40 border-black/10 hover:border-black/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-black/5 p-6 md:p-10 rounded-3xl hover:border-black/10 transition-all shadow-sm group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-black/[0.1] rounded-2xl flex items-center justify-center font-black italic">
                      {post.author[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight">{post.author}</h3>
                      <span className="text-[9px] font-mono tracking-[0.2em] opacity-40 uppercase">{post.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[9px] font-black opacity-20 uppercase tracking-widest">{post.timestamp}</span>
                    <button className="opacity-20 hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-sm mb-3 inline-block leading-none ${
                    post.category === 'QUERY' ? 'bg-orange-100 text-orange-600' : 
                    post.category === 'INFO' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {post.category}
                  </span>
                  <p className="text-base md:text-lg font-bold opacity-80 leading-relaxed uppercase tracking-tight">
                    {post.content}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-black/5">
                  <div className="flex gap-8">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 group/btn"
                    >
                      <div className="w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center group-hover/btn:bg-red-50 transition-colors">
                        <Heart size={14} className="group-hover/btn:text-red-500 transition-colors" />
                      </div>
                      <span className="text-[10px] font-black opacity-40 group-hover/btn:opacity-100">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 group/btn">
                      <div className="w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center group-hover/btn:bg-blue-50 transition-colors">
                        <MessageSquare size={14} className="group-hover/btn:text-blue-500 transition-colors" />
                      </div>
                      <span className="text-[10px] font-black opacity-40 group-hover/btn:opacity-100">{post.comments.length}</span>
                    </button>
                    <button className="flex items-center gap-2 group/btn">
                      <div className="w-8 h-8 rounded-full bg-black/[0.03] flex items-center justify-center group-hover/btn:bg-black group-hover/btn:text-white transition-all">
                        <Share2 size={14} />
                      </div>
                    </button>
                  </div>
                  
                  {/* Quick comment hint */}
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-black/[0.05] border-2 border-white" />)}
                    </div>
                    <span className="text-[9px] font-bold opacity-30 italic">ACTIVE_THREADS</span>
                  </div>
                </div>

                {/* Post Comments (Threaded) */}
                {post.comments.length > 0 && (
                  <div className="mt-8 space-y-4 pl-4 md:pl-10 border-l-2 border-black/[0.03]">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-tight">{comment.author}</span>
                          <span className="text-[9px] opacity-20 uppercase font-black">{comment.timestamp}</span>
                        </div>
                        <p className="text-xs font-bold opacity-60 uppercase">{comment.content}</p>
                      </div>
                    ))}
                    <div className="flex gap-4 pt-4">
                      <input 
                        type="text" 
                        placeholder="ADD_TO_THE_LOG..."
                        className="flex-1 bg-black/[0.03] border-none rounded-full px-4 py-2 text-[10px] font-bold uppercase focus:ring-0"
                      />
                      <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-black opacity-5 z-0" />
    </div>
  );
}
