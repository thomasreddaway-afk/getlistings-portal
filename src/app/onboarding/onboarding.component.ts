import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  skippable: boolean;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  currentStep = 0;
  loading = false;
  
  steps: OnboardingStep[] = [
    {
      id: 0,
      title: 'Welcome to GetListings!',
      description: 'Let\'s get you set up in just 3 minutes',
      completed: false,
      skippable: false
    },
    {
      id: 1,
      title: 'Set Your Location Preferences',
      description: 'Tell us which suburbs you want to track',
      completed: false,
      skippable: false
    },
    {
      id: 2,
      title: 'Connect Your Accounts',
      description: 'Link your calendar and communication tools',
      completed: false,
      skippable: true
    },
    {
      id: 3,
      title: 'Configure Notifications',
      description: 'Choose how you want to be alerted about new leads',
      completed: false,
      skippable: true
    },
    {
      id: 4,
      title: 'You\'re All Set!',
      description: 'Start finding your next listing',
      completed: false,
      skippable: false
    }
  ];

  // Step 1: Location preferences
  selectedSuburbs: string[] = [];
  suburbSearch = '';
  popularSuburbs = [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
    'Gold Coast', 'Newcastle', 'Canberra', 'Hobart', 'Darwin'
  ];

  // Step 2: Account connections
  connections = {
    googleCalendar: false,
    outlook: false,
    facebook: false,
    whatsapp: false
  };

  // Step 3: Notifications
  notifications = {
    email: true,
    sms: false,
    push: true,
    frequency: 'instant' // instant, hourly, daily
  };

  constructor(
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // Check if user has already completed onboarding
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (onboardingCompleted === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  next(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.steps[this.currentStep].completed = true;
      this.currentStep++;
    }
  }

  previous(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  skip(): void {
    if (this.steps[this.currentStep].skippable) {
      this.next();
    }
  }

  addSuburb(suburb: string): void {
    if (suburb && !this.selectedSuburbs.includes(suburb)) {
      this.selectedSuburbs.push(suburb);
      this.suburbSearch = '';
    }
  }

  removeSuburb(suburb: string): void {
    this.selectedSuburbs = this.selectedSuburbs.filter(s => s !== suburb);
  }

  toggleConnection(service: string): void {
    this.connections[service] = !this.connections[service];
  }

  async completeOnboarding(): Promise<void> {
    this.loading = true;

    try {
      // Save onboarding data
      const onboardingData = {
        suburbs: this.selectedSuburbs,
        connections: this.connections,
        notifications: this.notifications,
        completedAt: new Date().toISOString()
      };

      // TODO: Call API to save onboarding preferences
      // await this.userService.saveOnboardingPreferences(onboardingData);

      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('onboarding_data', JSON.stringify(onboardingData));

      this.message.success('Welcome aboard! Let\'s get started.');
      
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 500);
    } catch (error) {
      this.message.error('Failed to complete onboarding. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  get progress(): number {
    return (this.currentStep / (this.steps.length - 1)) * 100;
  }

  get canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.selectedSuburbs.length > 0;
      case 2:
        return true; // Optional step
      case 3:
        return true; // Optional step
      default:
        return true;
    }
  }
}
