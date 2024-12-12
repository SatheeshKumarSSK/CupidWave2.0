import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';
import { PresenceService } from '../../_services/presence.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  member = input.required<Member>();
  private likesService = inject(LikesService);
  private presenceService = inject(PresenceService);
  hasLiked = computed(() => this.likesService.likedIds().includes(this.member().id));
  isOnline = computed(() => this.presenceService.onlineUsers().includes(this.member().username));

  toggleLike() {
    this.likesService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.hasLiked())
          this.likesService.likedIds.update(ids => ids.filter(x => x !== this.member().id));
        else
          this.likesService.likedIds.update(ids => [...ids, this.member().id]);
      }
    })
  }
}
