import { Component, signal, inject, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  imports: [DecimalPipe],
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
    if (!stadt) return undefined;
    return this.weatherService.buildUrl(stadt);
  });

  protected readonly kategorie = computed(() => {
    const daten = this.wetter.value();
    if (!daten) return 'klar';
    const main = (daten as any).weather?.[0]?.main as string;
    if (main === 'Thunderstorm') return 'sturm';
    if (main === 'Rain' || main === 'Drizzle') return 'regen';
    if (main === 'Snow') return 'schnee';
    if (main === 'Clouds' || main === 'Mist' || main === 'Fog' || main === 'Haze') return 'wolkig';
    return 'klar';
  });

  protected readonly windDauer = computed(() => {
    const wind = (this.wetter.value() as any)?.wind?.speed ?? 3;
    return Math.max(1.2, 6 - wind * 0.4) + 's';
  });

  protected readonly regenTropfen = Array.from({ length: 40 }, (_, i) => i);
  protected readonly wolkenListe = Array.from({ length: 5 }, (_, i) => i);
  protected readonly baumListe = Array.from({ length: 6 }, (_, i) => i);

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.stadt.set(input.value);
  }

  suchen() {
    this.gesuchteStadt.set(this.stadt());
  }
}