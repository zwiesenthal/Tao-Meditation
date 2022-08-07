# Tao-Meditation
Tao Te Ching Meditation App
Names: The Daily Tao (Daily Dao)

## Main page:
    Minutes choice 3 - 60 or 0, just listen to it, or a button to check in
    Play / Pause Button
    Speak audio of tao page
    Then have silence or guided meditation for how long they say.
    Also likely have text of tao.

## Settings page
    Random shuffle or progress mode - 1 page at a time, show how many you've done, and maybe show streaks
    Guided, Unguided, Semiguided (just tells you when to let go of concentration 1 min before time is up)
    Donate button
    Default Time
    Font Size

## Future Features
    Male vs. Female Speaker Setting
    Ending Sound settings (upload your own maybe)
    Share prompts

## General Notes
    The app should be super cheap to make and host, no server needed, no accounts all local information. 
    No ads or payments.
    Name: Tao Meditation

## Sources
    free versions to use:
    https://www.taosurfers.com/ideasandwellbeing/2020/4/21/whats-the-best-tao-te-ching-translation-or-paraphrase-to-use
    https://ttc.tasuki.org/display:Code:gff,sm,jhmd,jc,rh/section:1
    Gia Fu Feng seems like the one to use - was taoist teacher, is public domain.

    1st = public domain (gia fu feng)
    2nd = not public domain
    3rd = public domain (j h mcdonald)
    4th = silly rhyme version, have no head douglass
    5th = don't charge people or change any words, and give him credit

    so mainly 1 and 3

## Packages
    https://www.npmjs.com/package/react-native-sound-player
    https://www.findsounds.com/ISAPI/search.dll?keywords=gong
    
## Common Issues
    Can't find audio file
    Re run npx react-native run-android
    Sometimes have to uninstall the app

    hard to npm i a package use --legacy-peer-deps

    to make it release: npx react-native run-android --variant=release

## How to run:
    npm start

    new tab

    npx react-native run-android

## To Make Release APK
    in android/app/build.gradle change versionCode to a higher int
                            and versionName to a higher string
    cd android
    ./gradlew assembleRelease
    ./gradlew bundleRelease

    https://play.google.com/console/u/0/developers/8771764714057627355/app/4973092038499727106/tracks/4697312108177620548/releases/2/prepare

    C:\Users\zwies\coding\projects\TaoMed\android\app\build\outputs\bundle\release\app-release.aab
    
