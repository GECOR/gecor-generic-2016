# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Changed
- Home buttons style changed and effect button click added
- List elements and list type incidences (step1 and step 2): change style and effect button click added

### Fixed
- In step 4 when geolocation fails, we can't send incidence because the entity location is wrong
- Login -> EntitiesModal -> TRIM to search field
- iPhone -> The second time sending an incidence always print entity location

## [1.0.0-beta.2] - 2016-09-12

### Changed
- Update project to Ionic beta.11
- Change Loading for LoadingController
- Change Alert for AlertController
- Change ActionSheet for ActionSheetController
- Hide tab bar in all subviews
- After finish an incidence do popToRoot instead of push to origin
- Add loading when we click on share incidence
- Download messages of chat when the view is loaded and now chta is open faster

### Fixed
- Do actions in some views on loading.onDidDismiss()
- Load incidences after new incidence
- After finish a incidence and come back to families the tab bar loses
- In forgott password no matter spaces
- When we are citizen now can search in search incidences
- When we are signing up and our email already exists, no block the app
- Reviewing, if not save the changes and cancel, the changes are lost
- Map not load correctly second time and not locate
- Add marker when gecolocate finish
- The button of legal terms view are not translate

### Added
- Print incidences colors in map view
- Citizens now can like and comment in his incidences reviewed
- Support for private elements
