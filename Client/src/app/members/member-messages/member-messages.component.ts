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
  @ViewChild('scrollMe') private scrollContainer?: ElementRef;
  username = input.required<string>();
  messageService = inject(MessageService);
  messageContent: string = "";
  loading = false;
  disableScrollDown = false;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  onScroll() {
    if (this.scrollContainer) {
      let element = this.scrollContainer.nativeElement;
      let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      if (this.disableScrollDown && atBottom) {
        this.disableScrollDown = false;
      } else {
        this.disableScrollDown = true;
      }
    }
  }

  private scrollToBottom() {
    if (this.scrollContainer && !this.disableScrollDown)
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.username(), this.messageContent)?.then(() => {
      this.messageForm?.reset();
      this.disableScrollDown = false;
      this.scrollToBottom();
      this.loading = false;
    })
  }
}
