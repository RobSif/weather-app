// weather.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  buildUrl(stadt: string): string {
    return `${this.baseUrl}?q=${stadt}&appid=${environment.apiKey}&units=metric&lang=de`;
  }
}