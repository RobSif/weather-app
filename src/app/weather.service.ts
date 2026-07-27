import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  getWetter(stadt: string) {
    return this.http.get(`${this.baseUrl}?q=${stadt}&appid=${environment.apiKey}&units=metric&lang=de`);
  }
}