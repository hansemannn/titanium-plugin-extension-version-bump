# Titanium Plugin: iOS App Extensions - Version Bump

Automatically bump the Info.plist versions of native iOS extensions when changing the app version in the tiapp.xml.

## Installation

1. Copy the "extension.versionbump" folder to `<project-root>/plugins` (create if not exists)
2. Reference the plugin in the tiapp.xml `<plugins>` tag:
```xml
<plugin>extension.versionbump</plugin>
```

## Author

Hans Knöchel

## LICENSE

MIT