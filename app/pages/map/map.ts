import {Page} from 'ionic-framework/ionic';
import {ConferenceData} from '../../providers/conference-data';

@Page({
  templateUrl: 'build/pages/map/map.html'
})
export class MapPage {
  constructor(private confData: ConferenceData) {}

}
