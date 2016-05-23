import {Page, NavController, MenuController, Alert} from 'ionic-angular';
import {forwardRef} from '@angular/core';
import {AndroidAttribute} from './../../../../../../directives/global.helpers';

@Page({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/comments/comments.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CommentsPage {
    constructor(private nav: NavController, private menu: MenuController) {

    }
}
