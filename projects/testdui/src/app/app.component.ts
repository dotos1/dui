import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'testdui';
  backConfig = {
    type: 'mat-icon-button',
    xtype: "dui-button",
    icon: 'arrow_back',
    handler: () => this.back()
  }
  back(){
    console.log('This is a back button!');
  }
}
