import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { TruncatePipe } from './truncate-pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoaderComponent,
    TruncatePipe
  ],
  exports: [
    LoaderComponent,
    TruncatePipe
  ],
  providers: [
    TruncatePipe
  ]
})
export class SharedModule {}
