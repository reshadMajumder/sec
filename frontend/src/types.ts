import React from 'react';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  number: string;
  icon: React.ReactNode;
  imageUrl: string;
}

export interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  index: number;
  activeIndex: number;
  isMobile: boolean;
}

export interface ProjectLabelProps {
  key?: React.Key;
  proj: Project;
  idx: number;
  activeIndex: number;
  isMobile: boolean;
  setActiveIndex: (i: number) => void;
}

export interface Activity {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Achievement {
  id: string;
  label: string;
  value: string;
}

export interface Wing {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  imageUrl: string;
  details?: {
    head?: string;
    membersCount?: string;
    focusAreas?: string[];
    establishmentDate?: string;
    achievements?: string[];
    keyProjects?: string[];
  };
}

export interface Member {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  initials?: string;
}

export interface CommitteeGroup {
  id: string;
  title: string;
  members: Member[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface Publication {
  id: string;
  title: string;
  issue: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
}
