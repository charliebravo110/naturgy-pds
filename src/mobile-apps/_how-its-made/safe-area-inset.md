# safe-area-inset . Keep content between notch and home bar in iOS

When platform is iOS, the content should be kept inside the safe area.

Reminder: viewport height = notch or dinamic island height + safe area height + homebar height.

## Problem
By default, the content is fullscreen, and the notch and home bar overlap the content.

## Solution applied

Place the content in a fixed window matching the safe area, acheived with css code together with the property `contentInset: 'always'` in capacitor.config.ts -> ios .

The existing div.app is used for this purpose and gets an additional class `is-ios` when the platform is iOS. 

`src/App.tsx` fragment 
```tsx
        <div className={'app' + (isIos() ? ' is-ios' : '')}>
```


`src/App.css` fragment of code added
```css

.app.is-ios {
  position: fixed;
  top: 0;
  height: 100%;
  overflow: auto;

  /* undo 'min-height: 100vh;' Because viewport height is > safe area in iOS then it would be a mistake 
  to force the div.app to be as tall as the viewport */
  min-height: unset;
}
```

`capacitor.config.ts`
```ts
  ios: {
    contentInset: 'always', // limits content height to the distance between notch or dinamic island and the homebar
  },
```

## Discarded approach: 

Keep the content fullscreen (by not setting the property `contentInset: 'always'` in capacitor.config.ts -> ios), wich is the default behavior, and makes the content to be shown under the notch and home bar, and then use CSS to keep the content inside the safe area.

Using CSS environment variables `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` to set the top and bottom of the div.app to the safe area.

```css
.app {
  position: fixed;
  top: env(safe-area-inset-top);
  bottom: env(safe-area-inset-bottom);
  left: env(safe-area-inset-left);
  right: env(safe-area-inset-right);
  overflow: scroll;
  background-color: white;
}
```

For this to work, the property `viewport-fit=cover` must be added to the meta tag `viewport` in `index.html`

`index.html` fragment
```html
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```
or
```html
    <meta name="viewport" content="viewport-fit=cover" />
```
Finally index.html left without changes. I repeat: discarded approach.

Links

https://developer.mozilla.org/en-US/docs/Web/CSS/env

https://github.com/ionic-team/capacitor/issues/1947

https://github.com/AlwaysLoveme/capacitor-plugin-safe-area

https://css-tricks.com/the-notch-and-css/

https://capacitorjs.com/docs/apis/status-bar#statusbarinfo