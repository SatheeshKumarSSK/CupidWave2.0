import { Component, inject, input, output, ViewChild } from '@angular/core';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { FormsModule, NgForm } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { TimeagoModule } from 'ngx-timeago';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [FormsModule, NgStyle, TimeagoModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  username = input.required<string>();
  messages = input.required<Message[]>();
  updatedMessage = output<Message>();
  messageService = inject(MessageService);
  messageContent: string = "";
  loading = false;

  sendMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.username(), this.messageContent).subscribe({
      next: response => {
        this.updatedMessage.emit(response);
        this.messageForm?.reset();
        this.loading = false;
      }
    })
  }
}
