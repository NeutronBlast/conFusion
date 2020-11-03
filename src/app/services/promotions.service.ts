import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Promotion } from '../shared/promotion';
import { baseURL } from '../shared/baseURL';
import { ProcessHttpMsgService } from './process-http-msg.service';
import { map, catchError } from 'rxjs/operators';
import { Leader } from '../shared/leader';

@Injectable({
  providedIn: 'root'
})
export class PromotionsService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
    let params = new HttpParams();
    params.append('id', id);

    return this.http.get<Promotion>(baseURL + 'promotions', {
      params: params
    }).pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    let params = new HttpParams();
    params.append('featured', 'true');

    return this.http.get<Promotion>(baseURL + 'promotions', {
      params: params
    }).pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
