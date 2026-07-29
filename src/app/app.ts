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
  protected readonly title = signal('World Weather');
  protected readonly stadt = signal('');
  protected readonly gesuchteStadt = signal('');
  protected readonly vorschlagsSuche = signal('');

  private debounceTimer?: ReturnType<typeof setTimeout>;
  private weatherService = inject(WeatherService);

  protected readonly wetter = httpResource<any>(() => {
    const stadt = this.gesuchteStadt();
    if (!stadt) return undefined;
    return this.weatherService.buildUrl(stadt);
  });

  protected readonly vorschlaege = httpResource<any[]>(() => {
    const suche = this.vorschlagsSuche();
    if (!suche || suche.length < 2) return undefined;
    return this.weatherService.buildGeoUrl(suche);
  });

  protected readonly kategorie = computed(() => {
    const daten = this.wetter.value();
    if (!daten) return 'klar';
    const main = (daten as any).weather?.[0]?.main as string;
    if (main === 'Thunderstorm') return 'sturm';
    if (main === 'Rain' || main === 'Drizzle') return 'regen';
    if (main === 'Snow') return 'schnee';
    if (main === 'Mist' || main === 'Fog' || main === 'Haze') return 'nebel';
    if (main === 'Clouds') return 'wolkig';
    return 'klar';
  });

  protected readonly istTag = computed(() => {
    const daten = this.wetter.value() as any;
    const icon: string = daten?.weather?.[0]?.icon ?? '01d';
    return icon.endsWith('d');
  });

  protected readonly videoUrl = computed(() => {
    const mapping: Record<string, string> = {
      regen: 'video-weather/rain.mp4',
      sturm: 'video-weather/thunder.mp4',
      wolkig: 'video-weather/cloudy-sky.mp4',
      nebel: 'video-weather/foggy.mp4',
      schnee: 'video-weather/snowy.mp4',
      klar: 'video-weather/cloudy-sky.mp4',
    };
    return mapping[this.kategorie()] ?? mapping['wolkig'];
  });

  protected readonly iconUrl = computed(() => {
    const daten = this.wetter.value() as any;
    if (!daten) return '';
    const owmIcon: string = daten.weather?.[0]?.icon ?? '01d';
    const code = owmIcon.slice(0, 2);
    const nacht = !this.istTag();

    const mapping: Record<string, string> = {
      '01': nacht ? 'clear-night' : 'clear-day',
      '02': nacht ? 'partly-cloudy-night' : 'partly-cloudy-day',
      '03': 'cloudy',
      '04': 'overcast',
      '09': nacht ? 'partly-cloudy-night-drizzle' : 'partly-cloudy-day-drizzle',
      '10': nacht ? 'partly-cloudy-night-rain' : 'partly-cloudy-day-rain',
      '11': nacht ? 'thunderstorms-night-rain' : 'thunderstorms-day-rain',
      '13': nacht ? 'partly-cloudy-night-snow' : 'partly-cloudy-day-snow',
      '50': nacht ? 'fog-night' : 'fog-day',
    };

    const name = mapping[code] ?? 'not-available';
    return `https://cdn.jsdelivr.net/npm/@meteocons/svg/fill/${name}.svg`;
  });

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const wert = input.value;
    this.stadt.set(wert);

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.vorschlagsSuche.set(wert);
    }, 300);
  }

  vorschlagWaehlen(name: string) {
    this.stadt.set(name);
    this.gesuchteStadt.set(name);
    this.vorschlagsSuche.set('');
  }

  suchen() {
    this.gesuchteStadt.set(this.stadt());
    this.vorschlagsSuche.set('');
  }
}