import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent, Project as ProjectInterface } from '../../components/project-card/project-card';
import { StatCardComponent, StatCard } from '../../components/stat-card/stat-card';
import { ProjectModalComponent } from '../../components/project-modal/project-modal';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-project',
  imports: [CommonModule, ProjectCardComponent, StatCardComponent, ProjectModalComponent],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {
  constructor(private modalService: ModalService) {}

  openProjectModal(project: ProjectInterface) {
    this.modalService.openModal(project);
  }
  projects: ProjectInterface[] = [
    {
      title: 'Sign Language to Text & Speech Translation',
      description: 'Real-time sign language recognition system achieving 85% accuracy in translating gestures to text and speech using CNN-based machine learning model.',
      image: 'SLTTTS_cover.png',
      techStack: ['Python', 'TensorFlow', 'OpenCV', 'WebSocket', 'Flask'],
      features: ['✓ 85% Recognition Accuracy', '✓ Real-time Processing', '✓ 10,000+ Training Images'],
      liveDemo: '#',
      github: 'https://github.com/soundar-19/Sign-Language-Translator',
      isFeatured: true,
      badge: 'Featured'
    },
    {
      title: 'Real Estate Navigator',
      description: 'Full-stack real estate platform with advanced search capabilities, filtering options, and responsive design for seamless user experience.',
      image: 'RealEstate_cover.png',
      techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'],
      features: ['✓ Advanced Property Search', '✓ Interactive Map Integration', '✓ User Authentication & Profiles'],
      liveDemo: '#',
      github: 'https://github.com/soundar-19/Real-Estate-Navigator',
      backgroundColor: 'rgb(165, 211, 237)'
    },
    {
      title: 'Personal Expense Tracker',
      description: 'Responsive expense tracking application with category-based visualization, monthly budget analysis, and secure user authentication.',
      image: 'Personal Expense Tracker_cover.png',
      techStack: ['MERN Stack', 'Chart.js', 'Firebase Auth', 'MongoDB'],
      features: ['✓ Real-time Expense Tracking', '✓ Visual Analytics Dashboard', '✓ Budget Alerts & Notifications'],
      liveDemo: '#',
      github: 'https://github.com/soundar-19/personal-expense-tracker'
    },
    {
      title: 'TrackCrack',
      description: 'AI-powered railway track crack detection system using computer vision to enhance railway safety and maintenance efficiency.',
      image: 'TrackCrack_cover.png',
      techStack: ['Python', 'OpenCV', 'Machine Learning', 'Image Processing'],
      features: ['✓ 92% Crack Detection Accuracy', '✓ Automated Safety Alerts', '✓ Real-time Image Processing'],
      liveDemo: '#',
      github: 'https://github.com/soundar-19/TrackCrack'
    },
    {
      title: 'Image Caption Generator',
      description: 'Deep learning model that automatically generates descriptive captions for images using CNN and RNN architectures.',
      image: 'ImageCaptionGen_cover.png',
      techStack: ['Python', 'TensorFlow', 'Keras', 'CNN', 'RNN'],
      features: ['✓ Multi-language Caption Support', '✓ 8000+ Vocabulary Dataset', '✓ Context-aware Descriptions'],
      liveDemo: '#',
      github: 'https://github.com/soundar-19/Image-Caption-Generator'
    }
  ];

  stats: StatCard[] = [
    {
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>',
      title: '700+',
      subtitle: 'LeetCode Problems Solved',
      iconType: 'svg'
    },
    {
      icon: '<svg width="40" height="40" viewBox="0 0 640 640" fill="currentColor"><path d="M541.9 192C527.4 167 349.5 64 320.5 64C291.5 64 113.6 166.8 99.2 192C84.8 217.2 84.7 422.8 99.2 448C113.7 473.2 291.6 576 320.5 576C349.4 576 527.3 473.1 541.8 448C556.3 422.9 556.3 217 541.8 192zM380.5 478.2C376.5 478.2 339.6 442.4 342.5 439.5C343.4 438.6 348.8 438 360 437.7C360 411.5 360.6 369.1 360.9 351.4C360.9 349.4 360.5 348 360.5 345.6L280.6 345.6C280.6 352.7 280.1 381.8 282 418.5C282.2 423 280.4 424.5 276.3 424.4C266.2 424.4 256 424.3 245.9 424.3C241.8 424.3 240 422.8 240.2 418.2C241.1 384.8 243.2 334.2 240 205.5L240 202.3C230.3 201.9 223.6 201.3 222.7 200.5C219.8 197.6 257.2 161.8 261.2 161.8C265.2 161.8 302.4 197.6 299.5 200.5C298.6 201.4 291.6 202 282.7 202.3L282.7 205.5C280.3 231.3 280.7 285.1 280.1 310.9L360.4 310.9C360.4 306.3 360.8 276.2 359.2 227.3C359.1 223.9 360.2 222.1 363.4 222.1C374.5 222 385.6 222 396.6 222C400.1 222 401.2 223.7 401.1 227.4C397.4 418.7 400.4 405.3 400.4 437.7C409.3 438.1 417.2 438.7 418.1 439.5C421 442.4 384.5 478.2 380.5 478.2L380.5 478.2z"/></svg>',
      title: 'Multiple',
      subtitle: 'HackerRank Certifications',
      iconType: 'svg'
    },
    {
      icon: '<svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/></svg>',
      title: '5+',
      subtitle: 'Major Projects Completed',
      iconType: 'svg'
    }
  ];
}
