import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  quote$: Observable<string>;
  isLoading: boolean;

  constructor(private quoteService: QuoteService) { }

  ngOnInit() {
    // this.isLoading = true;
    // this.quote$ =
    //   this.quoteService.getRandomQuote({ category: 'dev' })
    //   .pipe(finalize(() => { this.isLoading = false; }));
  }

}
