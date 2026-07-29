import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private geoUrl = 'https://api.openweathermap.org/geo/1.0/direct';

  buildUrl(stadt: string): string {
    return `${this.baseUrl}?q=${encodeURIComponent(stadt)}&appid=${environment.apiKey}&units=metric&lang=de`;
  }

  buildGeoUrl(stadt: string): string {
    return `${this.geoUrl}?q=${encodeURIComponent(stadt)}&limit=5&appid=${environment.apiKey}`;
  }
}