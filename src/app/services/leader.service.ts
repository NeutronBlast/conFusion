import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Leader } from '../shared/leader';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ProcessHttpMsgService } from './process-http-msg.service';
import { baseURL } from '../shared/baseURL';
import { map, catchError } from 'rxjs/operators'
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpMsgService) { }

  getLeaders(): Observable<Leader[]> {
    return this.http.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id: string): Observable<Leader> {
    let params = new HttpParams();
    params.append('id', id);

    return this.http.get<Leader>(baseURL + 'leadership', {
      params: params
    }).pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader(): Observable<Leader> {
    let params = new HttpParams();
    params.append('featured', 'true');

    return this.http.get<Leader>(baseURL + 'leadership', {
      params: params
    }).pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
