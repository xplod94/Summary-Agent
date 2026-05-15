import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatResponse } from "./app.models";

@Injectable()
export class AppService {
    constructor(private http: HttpClient) { }

    public getChatResponse(query: string): Observable<ChatResponse> {
        return this.http.post<ChatResponse>('http://localhost:3000/ask', { query });
    }
}