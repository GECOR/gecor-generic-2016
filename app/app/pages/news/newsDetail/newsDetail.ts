import {Page, NavController, NavParams,} from 'ionic-angular';
import {forwardRef} from 'angular2/core';
import {AndroidAttribute} from './../../../directives/global.helpers';

@Page({
  templateUrl: 'build/pages/news/newsDetail/newsDetail.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class NewsDetailPage {
  constructor(private nav: NavController, private params: NavParams) {}
}
