import { Component, signal, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { WeatherService } from './weather.service';
;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('weather-app');
  protected readonly stadt = signal('');
  protected readonly gesuchteStadt = signal('');

  private weatherService = inject(WeatherService);

  protected readonly wetter = httpResource<any>(() => {
    const stadt = this.gesuchteStadt();
    if (!stadt) return undefined; // kein Call, solange nichts gesucht wurde
    return this.weatherService.buildUrl(stadt);
  });

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.stadt.set(input.value);
  }

  suchen() {
    this.gesuchteStadt.set(this.stadt());
  }
}