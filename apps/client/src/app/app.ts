import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatResponse, IMessage } from './app.models';
import { AppService } from './app.service';
import { finalize, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  providers: [AppService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  public message = '';
  public loading = signal<boolean>(false);
  public messages = signal<IMessage[]>([]);

  private subscriptions = new Subscription();

  @ViewChild('chatWindow') private chatWindow!: ElementRef;

  constructor(private appService: AppService) { }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public sendMessage(): void {
    if (this.loading() || this.message === '') return;

    this.loading.set(true);
    this.updateMessages({
      sender: 'user',
      text: this.message
    });

    this.scrollToBottom();
    const chatSub = this.appService.getChatResponse(this.message).pipe(take(1), finalize(() => this.loading.set(false))).subscribe({
      next: (res: ChatResponse) => {
        this.updateMessages({
          sender: 'ai',
          text: res.summary,
          confidence: res.confidence
        });
      },
      complete: () => {
        this.scrollToBottom();
        this.message = '';
      },
      error: (err: any) => {
        console.error(err);
      }
    });

    this.subscriptions.add(chatSub);
  }

  private updateMessages(newMessage: IMessage): void {
    this.messages.update((messages: IMessage[]) => {
      messages.push(newMessage);
      return messages;
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight);
  }
}
