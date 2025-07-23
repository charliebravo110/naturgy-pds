# Platform dependent headers

Requirement: three existing headers must be sent with different values depending on the platform (web, android, ios)

quote email 11 jan 2023

```
...
 
Las cabeceras para indicar el sistema operativo serian las siguientes:
 
ClientID: ACUFDMvl
ClientSecret: 4CUFDMvl
X-Application: ACUFD
 
Para Android:
X-Appclient: ACUFDMA
 
Para ios:
X-Appclient: ACUFDMI
 
Saludos,
...
```
Doesnt work ATM (backend side not ready), so I created a feature flag to toggle it off until backend is ready (see `src/mobile-apps/common/configAndConstants.ts`)

```diff
 const COMMON_HEADERS = {
-  'X-Appclientid': 'ACUFDWeb',
-  'X-AppClient': 'ACUFDW',
+  'X-Appclientid': FEAT_FLAG_PLATFORM_DEPENDENT_HEADERS ? (isMobileApp() ? 'ACUFDMvl' : 'ACUFDWeb') : 'ACUFDWeb',
+  'X-AppClient': FEAT_FLAG_PLATFORM_DEPENDENT_HEADERS
+    ? isAndroid()
+      ? 'ACUFDMA'
+      : isIos()
+      ? 'ACUFDMI'
+      : 'ACUFDW'
+    : 'ACUFDW',
   'X-Application': 'ACUFD',
   'X-Appversion': '1.0.0.0',
-  'X-AppClientSecret': '4CUFDW3b',
+  'X-AppClientSecret': FEAT_FLAG_PLATFORM_DEPENDENT_HEADERS ? (isMobileApp() ? '4CUFDMvl' : '4CUFDW3b') : '4CUFDW3b',
   'Content-Type': 'application/json',
```

UPDATE: Requirements changed, finally only X-AppClient is platform dependent, it is already tried and working.