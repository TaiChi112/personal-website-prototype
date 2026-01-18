"use client"
import { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  FileText, 
  User, 
  Briefcase, 
  Menu, 
  X, 
  Github, 
  Linkedin, 
  ExternalLink, 
  ChevronRight,
  Calendar,
  Tag
} from 'lucide-react';

// --- 1. DATA STRUCTURE DEFINITIONS (TYPESCRIPT INTERFACES) ---

// สำหรับบทความเชิงลึก หรือ Technical Articles
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // ในของจริงอาจจะเป็น Markdown หรือ HTML
  publishedAt: string;
  tags: string[];
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
}

// สำหรับ Blog ทั่วไป หรือ Personal Log
interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  date: string;
  category: 'Personal' | 'Lifestyle' | 'DevLog';
  coverImage?: string;
}

// สำหรับ Documentation (เช่น คู่มือการใช้งาน Library ที่เราเขียน)
interface Doc {
  id: string;
  title: string;
  slug: string;
  section: string; // ใช้จัดกลุ่มใน Sidebar
  content: string;
  lastUpdated: string;
}

// สำหรับ Projects / Portfolio
interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail: string;
  featured: boolean;
}

// สำหรับ CV / Resume
interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface ResumeData {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  contact: {
    email: string;
    location: string;
  };
}

// --- 2. MOCK DATA ---

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding React Server Components',
    slug: 'react-server-components',
    excerpt: 'Deep dive into how RSC works under the hood and why it changes everything.',
    content: 'Full content goes here...',
    publishedAt: '2023-10-15',
    tags: ['React', 'Next.js', 'Web'],
    readTime: '8 min read',
    author: { name: 'Dev User', avatar: '/api/placeholder/32/32' }
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript',
    excerpt: 'Generic types, Utility types, and how to write cleaner code.',
    content: 'Full content goes here...',
    publishedAt: '2023-11-02',
    tags: ['TypeScript', 'Programming'],
    readTime: '12 min read',
    author: { name: 'Dev User', avatar: '/api/placeholder/32/32' }
  }
];

const MOCK_BLOGS: Blog[] = [
  {
    id: '1',
    title: 'My Journey into Tech',
    slug: 'my-journey',
    summary: 'How I started coding and what I learned along the way.',
    date: '2023-01-20',
    category: 'Personal',
    coverImage: 'journey.jpg'
  },
  {
    id: '2',
    title: 'Why I love Coffee while coding',
    slug: 'coffee-coding',
    summary: 'A lighthearted look at caffeine and bugs.',
    date: '2023-05-10',
    category: 'Lifestyle'
  }
];

const MOCK_DOCS: Doc[] = [
  {
    id: '1',
    title: 'Getting Started',
    slug: 'getting-started',
    section: 'Introduction',
    content: 'Installation guide and setup instructions.',
    lastUpdated: '2024-01-10'
  },
  {
    id: '2',
    title: 'Authentication',
    slug: 'auth',
    section: 'Core Concepts',
    content: 'How to handle user sessions securely.',
    lastUpdated: '2024-01-12'
  },
  {
    id: '3',
    title: 'Database Schema',
    slug: 'db-schema',
    section: 'Core Concepts',
    content: 'Explanation of the data models.',
    lastUpdated: '2024-01-15'
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    description: 'A comprehensive dashboard for managing products and orders using Next.js and Supabase.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://vercel.com',
    thumbnail: 'dashboard-thumb',
    featured: true
  },
  {
    id: '2',
    title: 'AI Chat Interface',
    description: 'A chat application leveraging OpenAI API with real-time streaming.',
    techStack: ['React', 'Node.js', 'Socket.io'],
    githubUrl: 'https://github.com',
    thumbnail: 'ai-thumb',
    featured: true
  },
  {
    id: '3',
    title: 'Personal Finance Tracker',
    description: 'Mobile-first web app to track daily expenses.',
    techStack: ['Vue', 'Firebase'],
    githubUrl: 'https://github.com',
    thumbnail: 'finance-thumb',
    featured: false
  }
];

const MOCK_RESUME: ResumeData = {
  name: 'Alex Developer',
  title: 'Full Stack Engineer',
  summary: 'Passionate developer with 5+ years of experience in building scalable web applications. Loves clean code and modern UI/UX.',
  skills: ['JavaScript/TypeScript', 'React/Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  contact: {
    email: 'alex@example.com',
    location: 'Bangkok, Thailand'
  },
  experience: [
    {
      id: '1',
      role: 'Senior Frontend Developer',
      company: 'Tech Innovations Co.',
      period: '2021 - Present',
      description: [
        'Led the migration of legacy app to Next.js.',
        'Improved site performance by 40%.',
        'Mentored junior developers.'
      ]
    },
    {
      id: '2',
      role: 'Web Developer',
      company: 'Digital Agency XY',
      period: '2018 - 2021',
      description: [
        'Developed responsive websites for various clients.',
        'Collaborated with designers to implement pixel-perfect UIs.'
      ]
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.Sc. Computer Science',
      institution: 'Bangkok University',
      year: '2014 - 2018'
    }
  ]
};

// --- 3. COMPONENTS ---

// Navigation Component
const Navbar = ({ activeTab, setActiveTab, isMenuOpen, setIsMenuOpen }: any) => {
  const navItems = [
    { name: 'Home', id: 'home', icon: <User size={18} /> },
    { name: 'Projects', id: 'projects', icon: <Code size={18} /> },
    { name: 'Articles', id: 'articles', icon: <BookOpen size={18} /> },
    { name: 'Blog', id: 'blog', icon: <FileText size={18} /> },
    { name: 'Docs', id: 'docs', icon: <FileText size={18} /> }, // Using FileText as generic doc icon
    { name: 'Resume', id: 'resume', icon: <Briefcase size={18} /> },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Alex.Dev
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full space-x-2 px-3 py-4 rounded-md text-base font-medium ${
                  activeTab === item.id 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Section Components
const HomeSection = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
    <div className="w-32 h-32 bg-gradient-to-tr from-blue-400 to-indigo-500 rounded-full mb-8 shadow-lg flex items-center justify-center text-white text-4xl font-bold">
      AD
    </div>
    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
      Building the <span className="text-blue-600">Future</span> with Code
    </h1>
    <p className="text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
      Hi, I'm Alex. A Full Stack Developer passionate about crafting beautiful, 
      functional, and scalable web applications.
    </p>
    <div className="flex space-x-4">
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
        View Projects
      </button>
      <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">
        Read Articles
      </button>
    </div>
    <div className="mt-12 flex space-x-6 text-gray-400">
      <Github className="w-6 h-6 hover:text-gray-900 cursor-pointer" />
      <Linkedin className="w-6 h-6 hover:text-blue-700 cursor-pointer" />
    </div>
  </div>
);

const ProjectsSection = () => (
  <div className="py-12 px-4 max-w-7xl mx-auto">
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-gray-900">Featured Projects</h2>
      <p className="text-gray-600 mt-2">Some of the things I've built recently.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {MOCK_PROJECTS.map((project) => (
        <div key={project.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 font-medium">Project Image</span>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{project.title}</h3>
              <div className="flex space-x-2">
                {project.githubUrl && <Github size={18} className="text-gray-400 hover:text-gray-900 cursor-pointer" />}
                {project.liveUrl && <ExternalLink size={18} className="text-gray-400 hover:text-blue-600 cursor-pointer" />}
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ArticlesSection = () => (
  <div className="py-12 px-4 max-w-4xl mx-auto">
    <div className="mb-10 border-b border-gray-200 pb-8">
      <h2 className="text-3xl font-bold text-gray-900">Technical Articles</h2>
      <p className="text-gray-600 mt-2">Deep dives into code, patterns, and architecture.</p>
    </div>
    <div className="space-y-8">
      {MOCK_ARTICLES.map((article) => (
        <article key={article.id} className="flex flex-col group cursor-pointer">
          <div className="flex items-center text-sm text-gray-500 mb-2 space-x-2">
            <Calendar size={14} />
            <span>{article.publishedAt}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
            {article.title}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">#{tag}</span>
              ))}
            </div>
            <span className="text-blue-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition">
              Read more <ChevronRight size={16} />
            </span>
          </div>
        </article>
      ))}
    </div>
  </div>
);

const BlogSection = () => (
  <div className="py-12 px-4 max-w-4xl mx-auto">
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Personal Blog</h2>
      <p className="text-gray-600 mt-2">Thoughts, life updates, and behind the scenes.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MOCK_BLOGS.map((blog) => (
        <div key={blog.id} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition cursor-pointer">
          <div className="mb-4">
             <span className={`px-2 py-1 text-xs font-bold rounded-full ${
               blog.category === 'Personal' ? 'bg-purple-100 text-purple-700' : 
               blog.category === 'Lifestyle' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
             }`}>
               {blog.category}
             </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{blog.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{blog.summary}</p>
          <span className="text-xs text-gray-400">{blog.date}</span>
        </div>
      ))}
    </div>
  </div>
);

const DocsSection = () => {
  const [activeDoc, setActiveDoc] = useState(MOCK_DOCS[0]);
  
  // Group docs by section
  const sections = Array.from(new Set(MOCK_DOCS.map(d => d.section)));

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto pt-8 min-h-[80vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 px-4 mb-8 md:mb-0 md:border-r border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Documentation</h3>
        {sections.map(section => (
          <div key={section} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">{section}</h4>
            <ul className="space-y-1">
              {MOCK_DOCS.filter(d => d.section === section).map(doc => (
                <li key={doc.id}>
                  <button
                    onClick={() => setActiveDoc(doc)}
                    className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                      activeDoc.id === doc.id 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {doc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 md:px-12">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{activeDoc.title}</h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-sm text-yellow-700">
              Note: This documentation is a prototype mock. Last updated on {activeDoc.lastUpdated}.
            </p>
          </div>
          <p className="text-gray-700 leading-relaxed">{activeDoc.content}</p>
          <div className="mt-8 pt-8 border-t border-gray-100">
             <div className="h-32 bg-gray-50 rounded flex items-center justify-center text-gray-400 text-sm italic">
               Example Code Snippet Area
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeSection = () => (
  <div className="py-12 px-4 max-w-4xl mx-auto bg-white shadow-sm border border-gray-100 my-8 rounded-xl print:shadow-none print:border-none">
    <div className="border-b border-gray-200 pb-8 mb-8 flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{MOCK_RESUME.name}</h1>
        <h2 className="text-xl text-blue-600 font-medium mb-4">{MOCK_RESUME.title}</h2>
        <div className="flex flex-col sm:flex-row sm:items-center text-gray-500 text-sm gap-2 sm:gap-6">
          <span>{MOCK_RESUME.contact.location}</span>
          <span>{MOCK_RESUME.contact.email}</span>
        </div>
      </div>
      <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
        <FileText size={16} /> Download PDF
      </button>
    </div>

    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Summary</h3>
      <p className="text-gray-600 leading-relaxed">{MOCK_RESUME.summary}</p>
    </div>

    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Experience</h3>
      <div className="space-y-8">
        {MOCK_RESUME.experience.map(exp => (
          <div key={exp.id}>
            <div className="flex justify-between items-baseline mb-2">
              <h4 className="text-xl font-bold text-gray-800">{exp.role}</h4>
              <span className="text-sm text-gray-500 font-medium">{exp.period}</span>
            </div>
            <div className="text-blue-600 font-medium mb-3">{exp.company}</div>
            <ul className="list-disc list-outside ml-5 space-y-1 text-gray-600">
              {exp.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {MOCK_RESUME.skills.map(skill => (
          <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">
            {skill}
          </span>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">Education</h3>
      {MOCK_RESUME.education.map(edu => (
        <div key={edu.id} className="flex justify-between items-baseline">
          <div>
            <h4 className="text-lg font-bold text-gray-800">{edu.institution}</h4>
            <div className="text-gray-600">{edu.degree}</div>
          </div>
          <span className="text-sm text-gray-500 font-medium">{edu.year}</span>
        </div>
      ))}
    </div>
  </div>
);

// --- 4. MAIN APP COMPONENT ---

export default function PersonalWebsite() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Render logic simulating simple routing
  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeSection />;
      case 'projects': return <ProjectsSection />;
      case 'articles': return <ArticlesSection />;
      case 'blog': return <BlogSection />;
      case 'docs': return <DocsSection />;
      case 'resume': return <ResumeSection />;
      default: return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      
      <main className="pt-16 min-h-screen">
        {renderContent()}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Alex Developer. Built with React & Tailwind.
          </p>
        </div>
      </footer>
    </div>
  );
}