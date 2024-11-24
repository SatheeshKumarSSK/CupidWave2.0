import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  memberService = inject(MembersService);
  messageService = inject(MessageService);
  activeTab?: TabDirective;
  route = inject(ActivatedRoute);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  messages: Message[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member.photos?.map(p => {
          this.images.push(new ImageItem({ src: p.url ?? "", thumb: p.url ?? "" }))
        })
      }
    })

    this.route.queryParams.subscribe({
      next: params => params['tab'] ? this.selectTab(params['tab']) : this.selectTab(0)
    })
  }

  selectTab(tabId: number) {
    if (this.memberTabs)
      this.memberTabs.tabs[Number(tabId)].active = true;

    // Another way of activating the tab by using string param value
    // const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
    // if (messageTab) messageTab.active = true;
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  onUpdateMessages(event: Message) {
    this.messages.push(event);
  }
}
