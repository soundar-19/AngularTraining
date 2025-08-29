import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkillTagsComponent } from '../../components/skill-tags/skill-tags';

@Component({
  selector: 'app-home',
  imports: [RouterModule, SkillTagsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  featuredProject = {
    title: 'Sign Language to Text & Speech Translation',
    description: 'Real-time sign language recognition system achieving 85% accuracy using advanced CNN architecture and machine learning algorithms. Features real-time video processing, gesture recognition, and text-to-speech conversion.',
    techStack: ['Python', 'TensorFlow', 'OpenCV', 'WebSocket', 'Flask', 'NumPy']
  };
}
