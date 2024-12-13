import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../_services/message.service';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Message } from '../_models/message';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ConfirmService } from '../_services/confirm.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ButtonsModule, FormsModule, PaginationModule, RouterLink, TitleCasePipe, TimeagoModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  private confirmService = inject(ConfirmService);
  messageService = inject(MessageService);
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.container, this.pageNumber, this.pageSize);
  }

  deleteMessage(id: number) {
    this.confirmService.confirm('Confirm delete message', 'Are you sure you want to delete this message?')?.subscribe({
      next: response => {
        if (response) {
          this.messageService.deleteMessage(id).subscribe({
            next: _ => {
              this.messageService.paginatedResult.update(prev => {
                if (prev && prev.items) {
                  prev.items.splice(prev.items.findIndex(x => x.id == id), 1);
                  return prev
                }
                else {
                  return prev;
                }
              })
            }
          })
        }
      }
    })
  }

  getRoute(message: Message) {
    if (this.container === 'Outbox') return `/members/${message.recipientUsername}`;
    else return `/members/${message.senderUsername}`;
  }

  pageChanged(event: any) {
    if (this.pageNumber !== event.page) {
      this.pageNumber = event.page;
      this.loadMessages();
    }
  }
}
