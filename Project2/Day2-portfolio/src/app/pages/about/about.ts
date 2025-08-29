import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent, StatCard } from '../../components/stat-card/stat-card';
import { SkillTagsComponent } from '../../components/skill-tags/skill-tags';

@Component({
  selector: 'app-about',
  imports: [CommonModule, StatCardComponent, SkillTagsComponent],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  achievements: StatCard[] = [
    {
      icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="#FFA116"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>',
      title: '700+ LeetCode Problems',
      subtitle: 'Solved complex algorithmic challenges across various difficulty levels',
      iconType: 'svg',
      url: 'https://leetcode.com/u/soundarraja'
    },
    {
      icon: '<svg width="60" height="60" viewBox="0 0 640 640" fill="#00EA64"><path d="M541.9 192C527.4 167 349.5 64 320.5 64C291.5 64 113.6 166.8 99.2 192C84.8 217.2 84.7 422.8 99.2 448C113.7 473.2 291.6 576 320.5 576C349.4 576 527.3 473.1 541.8 448C556.3 422.9 556.3 217 541.8 192zM380.5 478.2C376.5 478.2 339.6 442.4 342.5 439.5C343.4 438.6 348.8 438 360 437.7C360 411.5 360.6 369.1 360.9 351.4C360.9 349.4 360.5 348 360.5 345.6L280.6 345.6C280.6 352.7 280.1 381.8 282 418.5C282.2 423 280.4 424.5 276.3 424.4C266.2 424.4 256 424.3 245.9 424.3C241.8 424.3 240 422.8 240.2 418.2C241.1 384.8 243.2 334.2 240 205.5L240 202.3C230.3 201.9 223.6 201.3 222.7 200.5C219.8 197.6 257.2 161.8 261.2 161.8C265.2 161.8 302.4 197.6 299.5 200.5C298.6 201.4 291.6 202 282.7 202.3L282.7 205.5C280.3 231.3 280.7 285.1 280.1 310.9L360.4 310.9C360.4 306.3 360.8 276.2 359.2 227.3C359.1 223.9 360.2 222.1 363.4 222.1C374.5 222 385.6 222 396.6 222C400.1 222 401.2 223.7 401.1 227.4C397.4 418.7 400.4 405.3 400.4 437.7C409.3 438.1 417.2 438.7 418.1 439.5C421 442.4 384.5 478.2 380.5 478.2L380.5 478.2z"/></svg>',
      title: 'HackerRank Certified',
      subtitle: 'Frontend Developer (React) & Problem Solving (Intermediate)',
      iconType: 'svg',
      url: 'https://www.hackerrank.com/profile/soundarraja_2201'
    },
    {
      icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="#47A248"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>',
      title: 'MongoDB University',
      subtitle: 'Introduction to MongoDB certification',
      iconType: 'svg',
      url: 'https://ti-user-certificates.s3.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/93e3337b-7296-4707-9c10-4840e8375e3c-soundar-raja-b-it-f94bbc14-ce4d-4b11-ad3f-51f7aa724551-certificate.pdf'
    },
    {
      icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="#4285F4"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>',
      title: 'Google Cloud',
      subtitle: 'Google Cloud Study Jams OCT 2023',
      iconType: 'svg',
      url: 'https://www.cloudskillsboost.google/public_profiles/153cab29-6e95-4fca-a72d-e3e72ca6890f'
    },
    {
      icon: '<img src="64px-Oracle_logo.svg.png" alt="Oracle Logo" width="120" height="120" style="object-fit: contain; margin-bottom: -50px;">',
      title: 'Oracle Certified Professional',
      subtitle: 'Oracle APEX Cloud Developer Certificate',
      iconType: 'svg',
      url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=7E0CC86E1257D70DED399E7523D43D34EA213FBA0FCA0708117EB63EB731330D'
    },
    {
      icon: '<img src="tata-logo.svg.png" alt="Tata Logo" width="60" height="60" style="object-fit: contain;">',
      title: 'TCS CodeVita Season 12',
      subtitle: 'Global Rank 492 - Programming Competition',
      iconType: 'svg'
    },
    {
      icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      title: 'HALCYON \'23 - 1st Prize',
      subtitle: 'Quiz Competition at Sri Ramakrishna Engineering College',
      iconType: 'svg'
    },
    {
      icon: '<svg width="60" height="60" viewBox="0 0 24 24" fill="#C0C0C0"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      title: 'KALAM \'23 - 2nd Prize',
      subtitle: 'Competition at Sri Ramakrishna Engineering College',
      iconType: 'svg'
    }
  ];

  skillCategories = [
    {
      title: 'Programming Languages',
      skills: ['JavaScript', 'Java', 'C++', 'C', 'Python']
    },
    {
      title: 'Web Technologies',
      skills: ['React.js', 'Angular', 'Node.js', 'Express.js', 'Spring Boot', 'HTML', 'CSS', 'Tailwind CSS']
    },
    {
      title: 'Databases & Tools',
      skills: ['MongoDB', 'MySQL', 'GitHub', 'VS Code', 'Firebase']
    }
  ];
}
