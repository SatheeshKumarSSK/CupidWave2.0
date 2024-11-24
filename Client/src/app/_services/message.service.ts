import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { getPaginationHeaders, setPaginatedResponse } from './paginationHelpers';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  isOutbox = signal<boolean>(false);

  getMessages(container: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append('container', container);

    return this.http.get<Message[]>(`${this.baseUrl}/messages`, { observe: 'response', params }).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        container === 'Outbox' ? this.isOutbox.set(true) : this.isOutbox.set(false);
      }
    });
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/messages/thread/${username}`);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(`${this.baseUrl}/messages`, { recipientUsername: username, content });
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`);
  }
}
