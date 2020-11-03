import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ProcessHttpMsgService } from './process-http-msg.service';
import { baseURL } from '../shared/baseURL';
import { catchError, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpMsgService) { }

  postFeedback(feedback: Feedback): Observable<Feedback>{    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions)
      .pipe(delay(5000))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
