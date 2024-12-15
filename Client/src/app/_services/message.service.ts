import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../_models/pagination';
import { Message } from '../_models/message';
import { getPaginationHeaders, setPaginatedResponse } from './paginationHelpers';
import { User } from '../_models/user';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Group } from '../_models/group';
import { BusyService } from './busy.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private http = inject(HttpClient);
  private busyService = inject(BusyService);
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  hubConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<Message[]> | null>(null);
  isOutbox = signal<boolean>(false);
  messageThread = signal<Message[]>([]);

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder().withUrl(`${this.hubUrl}/message?user=${otherUsername}`, {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect().build();

    this.hubConnection.start()
      .catch(error => console.log(error))
      .finally(() => this.busyService.idle());

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThread.set(messages);
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread.update(messages => [...messages, message]);
    })

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(c => c.username === otherUsername)) {
        this.messageThread.update(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })
          return messages;
        });
      }
    })
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected)
      this.hubConnection?.stop().catch(error => console.log(error));
  }

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
    return this.hubConnection?.invoke('SendMessage', { recipientUsername: username, content });
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`);
  }
}
