import { inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + '/presence', {
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect().build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => {
      this.toastr.success(username + ' is Online');
      this.onlineUsers.update(users => [...users, username]);
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.toastr.warning(username + ' is Offline');
      this.onlineUsers.update(users => users.filter(u => u !== username));
    })

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsers.set(usernames);
    })

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr.info(`New message received from ${knownAs}`).onTap.pipe(take(1)).subscribe(() => {
        this.router.navigateByUrl(`members/${username}?tab=Messages`);
      })
    })
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected)
      this.hubConnection?.stop().catch(error => console.log(error));
  }
}
