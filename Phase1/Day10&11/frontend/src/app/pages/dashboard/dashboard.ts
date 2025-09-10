import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BugService, BugStats } from '../../services/bug.service';
import { AuthService } from '../../services/auth.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  totalBugs = 0;
  openBugs = 0;
  closedBugs = 0;
  highPriorityBugs = 0;
  username = '';
  stats: BugStats = { total: 0, open: 0, inProgress: 0, closed: 0, high: 0, medium: 0, low: 0 };

  // Pie Chart - Status Distribution
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: ['Open', 'In Progress', 'Closed'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  // Doughnut Chart - Priority Distribution
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartData: ChartData<'doughnut'> = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#dc2626', '#f59e0b', '#059669'],
      borderWidth: 3,
      borderColor: '#ffffff'
    }]
  };

  // Bar Chart - Status vs Priority
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Open',
        data: [0, 0, 0],
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        borderWidth: 1
      },
      {
        label: 'Closed',
        data: [0, 0, 0],
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1
      }
    ]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#1e40af'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#64748b' },
        grid: { color: '#e2e8f0' }
      },
      y: {
        ticks: { color: '#64748b' },
        grid: { color: '#e2e8f0' }
      }
    }
  };

  constructor(private bugService: BugService, private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadBugCounts();
  }

  loadBugCounts(): void {
    this.bugService.getBugStatistics().subscribe((stats: BugStats) => {
      this.stats = stats;
      this.totalBugs = stats.total;
      this.openBugs = stats.open;
      this.closedBugs = stats.closed;
      this.highPriorityBugs = stats.high;
      this.updateCharts();
    });
  }

  private updateCharts(): void {
    // Update Pie Chart
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: [this.stats.open, this.stats.inProgress, this.stats.closed]
      }]
    };

    // Update Doughnut Chart
    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [{
        ...this.doughnutChartData.datasets[0],
        data: [this.stats.high, this.stats.medium, this.stats.low]
      }]
    };

    // Update Bar Chart with real data correlation
    const openHigh = Math.round((this.stats.high * this.stats.open) / this.stats.total) || 0;
    const openMedium = Math.round((this.stats.medium * this.stats.open) / this.stats.total) || 0;
    const openLow = Math.round((this.stats.low * this.stats.open) / this.stats.total) || 0;
    
    const closedHigh = this.stats.high - openHigh;
    const closedMedium = this.stats.medium - openMedium;
    const closedLow = this.stats.low - openLow;

    this.barChartData = {
      ...this.barChartData,
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: [openHigh, openMedium, openLow]
        },
        {
          ...this.barChartData.datasets[1],
          data: [closedHigh, closedMedium, closedLow]
        }
      ]
    };
  }
}
