import React from 'react';
import { 
  Terminal, 
  Lock, 
  Cpu, 
  Globe, 
  Hash, 
  Target, 
  FolderRoot, 
  Users, 
  Camera, 
  Megaphone, 
  Heart, 
  Globe2, 
  Code2, 
  Palette, 
  Laptop2, 
  BookOpen, 
  Trophy, 
  Music 
} from 'lucide-react';
import { Project, Activity, Achievement, Wing, CommitteeGroup, Event, Publication } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'core',
    name: 'CORE SYSTEM',
    tagline: 'ENGINEERING EXCELLENCE.',
    description: 'RELIABLE INFRASTRUCTURE AT SCALE.',
    number: '01',
    icon: <Terminal className="w-4 h-4" />,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'shield',
    name: 'CYBER SHIELD',
    tagline: 'SECURE BY DESIGN.',
    description: 'PROACTIVE DEFENSE STRATEGIES.',
    number: '02',
    icon: <Lock className="w-4 h-4" />,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'datalab',
    name: 'DATA LAB',
    tagline: 'SMART ANALYTICS.',
    description: 'TUNED FOR HIGH PERFORMANCE.',
    number: '03',
    icon: <Cpu className="w-4 h-4" />,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'opensource',
    name: 'OPEN SOURCE',
    tagline: 'COLLECTIVE MIND.',
    description: 'CONTRIBUTING TO THE ECOSYSTEM.',
    number: '04',
    icon: <Globe className="w-4 h-4" />,
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2128&auto=format&fit=crop'
  },
  {
    id: 'research',
    name: 'AI RESEARCH',
    tagline: 'FUTURE SYSTEMS.',
    description: 'NEURAL ARCHITECTURES AT SCALE.',
    number: '05',
    icon: <Cpu className="w-4 h-4" />,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'mobile',
    name: 'MOBILE STACK',
    tagline: 'FLUID INTERFACES.',
    description: 'NATIVE PERFORMANCE EVERYWHERE.',
    number: '06',
    icon: <Hash className="w-4 h-4" />,
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop'
  }
];

export const ACTIVITIES: Activity[] = [
  {
    id: 'activity-1',
    date: 'April 2026',
    title: 'Career Planning Roadmap Seminar',
    description: 'A day-long seminar on Career maping For the students under the Art Of Living Course.',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'activity-2',
    date: 'March 2026',
    title: 'Biggest Iftar Mahfil on Campus',
    description: 'The DIU Software Engineering Club warmly congratulates all the graduates of Daffodil International University on the occasion of its 13th Convocation.',
    imageUrl: 'https://images.unsplash.com/photo-1563293750-bcc5ad60203f?q=80&w=2077&auto=format&fit=crop'
  },
  {
    id: 'activity-3',
    date: 'November 2025',
    title: 'Club Get Together',
    description: 'From meaningful conversations to shared ideas and future plans, every moment reflected the spirit of collaboration that defines our club.',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'stat-1', label: 'Members', value: '500+' },
  { id: 'stat-2', label: 'Seminars', value: '50+' },
  { id: 'stat-3', label: 'Events', value: '20+' },
  { id: 'stat-4', label: 'National Awards', value: '5+' }
];

export const WINGS: Wing[] = [
  {
    id: 'program',
    name: 'Program Organization',
    description: 'Planning, managing, and executing all club events from idea generation to successful completion.',
    icon: <Target className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?q=80&w=2070&auto=format&fit=crop',
    details: {
      head: 'Md. Rufayed Islam Pial',
      membersCount: '45+',
      focusAreas: ['Event Logic', 'Logistics', 'Stage Mgmt', 'Vendor Relations'],
      establishmentDate: 'Sept 2024',
      achievements: ['30+ Successfull Events', 'Campus Excellence Award', 'Volunteer Coordination System'],
      keyProjects: ['Freshers Orientation 2025', 'SEC Anniversary Gala', 'Tech Fest Logistics']
    }
  },
  {
    id: 'office',
    name: 'Office & Organization',
    description: 'Managing official records, documentation, and maintaining administrative workflow.',
    icon: <FolderRoot className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    details: {
      head: 'S.M. Rakib & Intisifar Awal Hrid',
      membersCount: '25+',
      focusAreas: ['Compliance', 'Database', 'HR', 'Resource Allocation'],
      establishmentDate: 'Oct 2024',
      achievements: ['Paperless Workflow', 'Digital Archive v2', 'Automated Attendance'],
      keyProjects: ['Central Club Registry', 'Inventory Management System']
    }
  },
  {
    id: 'welfare',
    name: 'Student Welfare',
    description: 'Ensuring student support, engagement, and well-being within the club community.',
    icon: <Users className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop',
    details: {
      head: 'Mehedi Hasan',
      membersCount: '60+',
      focusAreas: ['Mentorship', 'Grievance', 'Engagement', 'Career Guidance'],
      establishmentDate: 'Aug 2024',
      achievements: ['100% Query Resolution', 'Peer Support System', 'Health Awareness Camp'],
      keyProjects: ['Mental Health Workshops', 'Student Discount Program']
    }
  },
  {
    id: 'media',
    name: 'Media & Press',
    description: 'Handling media coverage, content publishing, and official announcements.',
    icon: <Camera className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop',
    details: {
      head: 'FAHIM BIN FORHAD',
      membersCount: '35+',
      focusAreas: ['Photography', 'Journalism', 'PR Content', 'Live Broadcasting'],
      establishmentDate: 'Jan 2025',
      achievements: ['1M+ Monthly Reach', 'BBC Media Collab', 'Best Club Media Unit'],
      keyProjects: ['SEC Monthly Newsletter', 'Convocation Coverage', 'YouTube Tech Series']
    }
  },
  {
    id: 'pr',
    name: 'Public Relations',
    description: 'Building relationships with external organizations and promoting club identity.',
    icon: <Megaphone className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop',
    details: {
      head: 'Sayem Mohammad Prince',
      membersCount: '20+',
      focusAreas: ['Sponsorship', 'Branding', 'Networking', 'Corporate Relations'],
      establishmentDate: 'Nov 2024',
      achievements: ['15+ Industry Partners', 'Global Identity Revamp', 'Summit Sponsorship Lead'],
      keyProjects: ['Industry-Academia Summit', 'Internship Placement Drive', 'SEC Alumni Network']
    }
  },
  {
    id: 'women',
    name: 'Women Welfare',
    description: 'Supporting female members and promoting inclusive participation across activities.',
    icon: <Heart className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop',
    details: {
      head: 'Jannatul Nayim Prithibi',
      membersCount: '80+',
      focusAreas: ['Leadership', 'Inclusion', 'Skill Dev', 'Gender Equality'],
      establishmentDate: 'Dec 2024',
      achievements: ['Top Women in Tech Award', 'Mentorship Circle', 'Girls Coding Contest'],
      keyProjects: ['Women Tech-Makers Event', 'Safe Campus Initiative', 'Female Founder Series']
    }
  },
  {
    id: 'international',
    name: 'International Relations',
    description: 'Connecting with global organizations and fostering international collaboration.',
    icon: <Globe2 className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop',
    details: {
      head: 'Ahsan Habib',
      membersCount: '15+',
      focusAreas: ['Global Outreach', 'X-Border Events', 'Exchange', 'Diplomacy'],
      establishmentDate: 'Feb 2025',
      achievements: ['MIT Collab Initiative', 'EuroTour Delegate', 'International Seminar Series'],
      keyProjects: ['Global Tech Exchange', 'Sustainable Dev Goals Project', 'Foreign University Tours']
    }
  },
  {
    id: 'acm',
    name: 'ACM',
    description: 'Organizing ACM-based activities, contests, and technical development programs.',
    icon: <Code2 className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    details: {
      head: 'Md. Eusha Hasan & Siyam Bhulyan',
      membersCount: '120+',
      focusAreas: ['CP', 'Contests', 'Algo Mastery', 'Problem Setting'],
      establishmentDate: 'Pre-2024',
      achievements: ['Regional Finals 2024', '100+ Contest Organised', 'ICPC World Finals Prep'],
      keyProjects: ['SEC Online Judge', 'Coding Bootcamps', 'Monthly Mock Contests']
    }
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Creating visual identity, posters, and user interface designs for club activities.',
    icon: <Palette className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2070&auto=format&fit=crop',
    details: {
      head: 'Md. Mubashshir Alam',
      membersCount: '30+',
      focusAreas: ['UI/UX', 'Graphics', 'Motion Design', 'Brand Identity'],
      establishmentDate: 'Sept 2024',
      achievements: ['Behance Featured', 'Adobe Design Award', 'Best Visual Content Team'],
      keyProjects: ['SEC Brand Guidelines', 'UI/UX Workshop Series', 'Event Promo Motion Videos']
    }
  },
  {
    id: 'dev',
    name: 'Development',
    description: 'Developing web systems, tools, and software solutions for club projects.',
    icon: <Laptop2 className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop',
    details: {
      head: 'Jahidul Hassan Reshad',
      membersCount: '50+',
      focusAreas: ['Full Stack', 'Cloud', 'DevOps', 'App Dev'],
      establishmentDate: 'Aug 2024',
      achievements: ['Campus Portal Dev', 'Open Source Champion', 'Internal HR Tool'],
      keyProjects: ['Student Info System', 'SEC Official Website', 'Mobile App Beta']
    }
  },
  {
    id: 'research',
    name: 'Research & Publication',
    description: 'Conducting research activities and publishing technical and academic content.',
    icon: <BookOpen className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2069&auto=format&fit=crop',
    details: {
      head: 'Md Rakibul Hasan Shaon',
      membersCount: '20+',
      focusAreas: ['ML Research', 'Journals', 'Technical Writing', 'Data Science'],
      establishmentDate: 'Oct 2024',
      achievements: ['IEEE Paper Published', 'Research Grant 2025', 'Journal of Computing Founder'],
      keyProjects: ['NLP Sentiment Engine', 'Blockchain in Edu Paper', 'AI in Agri Research']
    }
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Organizing sports events and promoting physical activities among members.',
    icon: <Trophy className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop',
    details: {
      head: 'Md. Abul Hasnat Himel',
      membersCount: '100+',
      focusAreas: ['E-Sports', 'Outdoor', 'Atheletics', 'Physical Health'],
      establishmentDate: 'Nov 2024',
      achievements: ['Inter-Dept Cricket Win', 'Gaming Fest Organizer', 'Club Olympiad Silver'],
      keyProjects: ['SEC Premier League', 'Valorant Tournament', 'Annual Sports Meet']
    }
  },
  {
    id: 'cultural',
    name: 'Cultural',
    description: 'Managing cultural programs, performances, and entertainment activities.',
    icon: <Music className="w-5 h-5" />,
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop',
    details: {
      head: 'MD. Mahmudul Hasan Rafi',
      membersCount: '40+',
      focusAreas: ['Music', 'Drama', 'Tradition', 'Performing Arts'],
      establishmentDate: 'Dec 2024',
      achievements: ['Cultural Night Award', 'Heritage Preservation', 'Best Performance Team'],
      keyProjects: ['Drama Production 2025', 'SEC Music Fest', 'Poetry Showcase']
    }
  }
];

export const COMMITTEE: CommitteeGroup[] = [
  {
    id: 'advisors',
    title: 'Advisors',
    members: [
      { id: 'adv1', name: 'Prof. Dr. Imran Mahmud', role: 'Advisor', initials: 'IM', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=600' },
      { id: 'adv2', name: 'Dr. Md. Fazla Elahe', role: 'Advisor', initials: 'FE', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=600' },
      { id: 'adv3', name: 'Md. Rajib Mia', role: 'Advisor', initials: 'RM', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=600' }
    ]
  },
  {
    id: 'mentors',
    title: 'Convenors & Mentors',
    members: [
      { id: 'men1', name: 'Izaz Ahmmed Tuhin', role: 'Convenor', initials: 'IT', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=600' },
      { id: 'men2', name: 'Abdul Hye Zebon', role: 'Co-Convener', initials: 'AZ', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=600' },
      { id: 'men3', name: 'K. M. Shahriar Islam', role: 'Mentor', initials: 'SI', imageUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=400&h=600' },
      { id: 'men4', name: 'Fazla Rabby Raihan', role: 'Mentor', initials: 'FR', imageUrl: 'https://images.unsplash.com/photo-1504257404131-397a23969784?auto=format&fit=crop&w=400&h=600' }
    ]
  },
  {
    id: 'leadership',
    title: 'Core Leadership',
    members: [
      { id: 'ldr1', name: 'Md. Abdul Alim', role: 'President', initials: 'AL', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=600' },
      { id: 'ldr2', name: 'Md Shahriar Rashid Rahi', role: 'Vice President', initials: 'RR', imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&h=600' },
      { id: 'ldr3', name: 'Sayed Ruman', role: 'General Secretary', initials: 'SR', imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&h=600' },
      { id: 'ldr4', name: 'Md Imran Tarafdar', role: 'Treasurer', initials: 'IT', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&h=600' },
      { id: 'ldr5', name: 'Simanta Kumar Roy', role: 'Vice President', initials: 'SK', imageUrl: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=400&h=600' },
      { id: 'ldr6', name: 'Piyash Basak', role: 'VP - Design & Development', initials: 'PB', imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&h=600' },
      { id: 'ldr7', name: 'MD Walliul Islam Nohan', role: 'VP - ACM', initials: 'WN', imageUrl: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?auto=format&fit=crop&w=400&h=600' },
      { id: 'ldr8', name: 'Md Mahfuzur Rahman Shanto', role: 'VP - Industry & Career', initials: 'MS', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=600' }
    ]
  },
  {
    id: 'secretaries',
    title: 'Secretaries',
    members: [
      { id: 'sec1', name: 'Md. Mahadi Hasan', role: 'Joint Secretary', initials: 'MH', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec2', name: 'Abdullah Al Maruf Supto', role: 'Joint Secretary', initials: 'AM', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec3', name: 'Jahidul Hassan Reshad', role: 'Development Secretary', initials: 'JH', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec4', name: 'Md. Eusha Hasan', role: 'ACM Secretary', initials: 'EH', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec5', name: 'Siyam Bhulyan', role: 'ACM Secretary', initials: 'SB', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec6', name: 'Mehedi Hasan', role: 'Student Welfare Secretary', initials: 'MH', imageUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec7', name: 'Jannatul Nayim Prithibi', role: 'Women Welfare Secretary', initials: 'JN', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec8', name: 'Md Rakibul Hasan Shaon', role: 'Research & Publications Secretary', initials: 'RH', imageUrl: 'https://images.unsplash.com/photo-1504257404131-397a23969784?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec9', name: 'Ahsan Habib', role: 'International Relation Secretary', initials: 'AH', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec10', name: 'S.M. Rakib', role: 'Office & Organization Secretary', initials: 'SR', imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec11', name: 'Intisifar Awal Hrid', role: 'Office & Organization Secretary', initials: 'IA', imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec12', name: 'MD. Rufayed Islam Pial', role: 'Program Organization Secretary', initials: 'PI', imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec13', name: 'Md. Abul Hasnat Himel', role: 'Sports Secretary', initials: 'AH', imageUrl: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec14', name: 'MD. Mahmudul Hasan Rafi', role: 'Cultural Secretary', initials: 'MH', imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec15', name: 'Sayem Mohammad Prince', role: 'Public Relation Secretary', initials: 'SP', imageUrl: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec16', name: 'FAHIM BIN FORHAD', role: 'Media & Press Secretary', initials: 'FB', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=400' },
      { id: 'sec17', name: 'Md. Mubashshir Alam', role: 'Design Secretary', initials: 'MA', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=400' }
    ]
  }
];

export const EVENTS: Event[] = [
  {
    id: 'ev-01',
    title: 'TECH SUMMIT 2026',
    date: 'MAY 15, 2026',
    location: 'MAIN AUDITORIUM',
    description: 'A deep dive into the future of engineering and AI with industry pioneers.',
    imageUrl: 'https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?auto=format&fit=crop&w=1200&h=1600'
  },
  {
    id: 'ev-02',
    title: 'CODE SPRINT XI',
    date: 'JUNE 02, 2026',
    location: 'SEC LAB 402',
    description: 'The legendary 24-hour hackathon returns to challenge the best coders on campus.',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=1600'
  },
  {
    id: 'ev-03',
    title: 'DESIGN SYMPOSIUM',
    date: 'JUNE 20, 2026',
    location: 'INNOVATION HUB',
    description: 'Exploring the intersection of UI, UX and Motion for modern digital products.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&h=1600'
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'pub-01',
    title: 'TECH PULSE',
    issue: 'VOL. 04 / ISSUE 01',
    description: 'Our flagship e-magazine covering deep learning, cybersecurity trends, and club achievements of the semester.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&h=1100',
    pdfUrl: '#'
  },
  {
    id: 'pub-02',
    title: 'SEC CHRONICLES',
    issue: 'SPECIAL EDITION 2025',
    description: 'A retrospective on the biggest hackathons and community events that shaped our technical landscape.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&h=1100',
    pdfUrl: '#'
  }
];

export const HISTORICAL_COMMITTEES = [
  {
    year: '2024 - 2025',
    title: 'THE FOUNDATION ERA',
    description: 'The legends who transitioned the club into its high-performance era.',
    groups: [
      {
        id: 'h24-ldr',
        title: 'Core Leadership',
        members: [
          { id: 'h24-1', name: 'Md. Abdul Alim', role: 'President', initials: 'AA', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=600' },
          { id: 'h24-2', name: 'Md Shahriar Rashid Rahi', role: 'Vice President', initials: 'SR', imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=400&h=600' },
          { id: 'h24-3', name: 'Sayed Ruman', role: 'General Secretary', initials: 'SR', imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&h=600' }
        ]
      },
      {
        id: 'h24-sec',
        title: 'Operational Secretaries',
        members: [
          { id: 'h24-4', name: 'Jahidul Hassan Reshad', role: 'Dev Secretary', initials: 'JR', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=600' },
          { id: 'h24-5', name: 'Piyash Basak', role: 'Design Secretary', initials: 'PB', imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&h=600' },
          { id: 'h24-6', name: 'Md. Eusha Hasan', role: 'ACM Secretary', initials: 'EH', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=600' },
          { id: 'h24-7', name: 'Siyam Bhulyan', role: 'ACM Secretary', initials: 'SB', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=600' }
        ]
      }
    ]
  },
  {
    year: '2023 - 2024',
    title: 'THE RENAISSANCE',
    description: 'A transformative period where community engagement reached new heights.',
    groups: [
      {
        id: 'h23-ldr',
        title: 'Legacy Leadership',
        members: [
          { id: 'h23-1', name: 'Legendary Leader A', role: 'Ex-President', initials: 'LA', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=600' },
          { id: 'h23-2', name: 'Legendary Leader B', role: 'Ex-General Secretary', initials: 'LB', imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=600' }
        ]
      }
    ]
  }
];
