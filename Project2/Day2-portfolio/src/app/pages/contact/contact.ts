import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionCardComponent, ActionCard } from '../../components/action-card/action-card';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule, ActionCardComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
    alert('Thank you for your message! I\'ll get back to you soon.');
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  quickActions: ActionCard[] = [
    {
      icon: 'pi-envelope',
      title: 'Email Me',
      description: 'Drop me a line directly',
      link: 'mailto:soundarrajacf@gmail.com'
    },
    {
      icon: 'pi-phone',
      title: 'Call Me',
      description: 'Let\'s talk directly',
      link: 'tel:+917777777777'
    },
    {
      icon: 'pi-linkedin',
      title: 'Connect',
      description: 'Professional network',
      link: 'https://linkedin.com/in/soundarraja',
      isExternal: true
    },
    {
      icon: 'pi-calendar',
      title: 'Schedule',
      description: 'Book a meeting',
      link: 'https://calendly.com/soundarraja',
      isExternal: true
    }
  ];
}
