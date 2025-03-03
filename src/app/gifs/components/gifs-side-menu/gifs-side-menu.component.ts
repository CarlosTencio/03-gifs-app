import { Component } from '@angular/core';
import { GifSideMenuHeaderComponent } from "./gifs-side-menu-header/gifs-side-menu-header.component";
import { GifSideMenuOptionsComponent } from "./gifs-side-menu-options/gifs-side-menu-options.component";

@Component({
  selector: 'gifs-side-menu',
  imports: [GifSideMenuHeaderComponent, GifSideMenuOptionsComponent],
  templateUrl: './gifs-side-menu.component.html',
})
export class GifsSideMenuComponent {

}
