export interface AstronomicalEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  description: string;
  details?: string;
  significance?: string;
  type: 'discovery' | 'mission' | 'celestial' | 'milestone';
  location?: string;
  source?: string;
  image?: string;
  copyright?: string; 
  copyrightHtml?: string; 
}