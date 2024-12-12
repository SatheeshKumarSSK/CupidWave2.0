import { AfterViewChecked, Component, ElementRef, inject, input, ViewChild } from '@angular/core';
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
export class MemberMessagesComponent implements AfterViewChecked {
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('scrollMe') private myScrollContainer?: ElementRef;
  username = input.required<string>();
  messageService = inject(MessageService);
  messageContent: string = "";
  loading = false;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.myScrollContainer)
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.username(), this.messageContent)?.then(() => {
      this.messageForm?.reset();
      this.loading = false;
    })
  }
}
