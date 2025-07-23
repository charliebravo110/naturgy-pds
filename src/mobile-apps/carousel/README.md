# Carousel

## Feature description and requirements

A mobile touch slider/carousel.
Each slide can have an image, a title and a subtitle.

Shown only for mobile apps (not for web).

Double usage:
 1. To showcase onboarding features, this is the `welcome` carousel, displayed after the first login. Route: `/welcome`
 2. To showcase new features of new versions, this is the `what is new` carousel, displayed after the first login after an app update. Route: `/what-is-new`

Followed the design received from the design team, with figma.

Once the user has seen a carousel, it should not be shown again.

At least not until the next update or until the user reinstalls the app (in the same device or in another device).

The content of the slides is stored in:
 - 📁 `src\mobile-apps\carousel\welcome-data` for the `welcome` carousel
 - 📁 `src\mobile-apps\carousel\what-is-new-data` for the `what is new` carousel

Using swiper, see https://swiperjs.com/