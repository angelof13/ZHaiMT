import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('ICP') ICP: any;
  location = '0';

  title = '13号的世界树';

  ICP_Transform() {
    this.ICP.nativeElement.style.transform = 'translateX(' + this.location + 'px)';
    this.location = this.location == '0' ? "175" : '0';
  }
}
