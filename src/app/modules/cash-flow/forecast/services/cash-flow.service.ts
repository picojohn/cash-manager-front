import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICashFlowForecastResponse } from '../interface/cash-flow.interface';

@Injectable({ providedIn: 'root' })
export class CashFlowService {
  private url = environment.endpoint;

  constructor(private http: HttpClient) {}

  getForecast(weeks = 5): Observable<ICashFlowForecastResponse> {
    return this.http.get<ICashFlowForecastResponse>(
      `${this.url}/cash-flow/forecast?weeks=${weeks}`,
    );
  }
}
