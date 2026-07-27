import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  //imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('weather-app');
  protected readonly stadt = signal('');

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.stadt.set(input.value);
  }

  suchen() {
    console.log('Suche Wetter für:', this.stadt());
  }
}
