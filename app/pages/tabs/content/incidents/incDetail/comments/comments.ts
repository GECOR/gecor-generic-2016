import {Page, NavController, MenuController, Alert} from 'ionic-framework/ionic';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../../../../../directives/global.helpers';

@Page({
  templateUrl: './build/pages/tabs/content/incidents/incDetail/comments/comments.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class CommentsPage {
    constructor(private nav: NavController, private menu: MenuController) {

    }
}
