# Disclaimer, why and how we bumped the version of typescript

⚠️ 
We upgraded typescript because it was needed by the new packages added for this development (Capacitor).  

We had to modify two lines of the existing code to make it work.

Chronology:

After `yarn add @capacitor/core` we got typescript errors like this:

```bash

TypeScript error in C:/Users/.../node_modules/@capacitor/core/types/core-plugins.d.ts(1,13):
'=' expected.  TS1005

  > 1 | import type { Plugin } from './definitions';
```
because capacitor uses import type, which was a new feature introduced four years ago with typescript 3.8, and this project was using typescript <3.5.0 (version from may 2019)

We upgraded typescript to ^3.9.10, and we got this two errors from the existing code:

```bash
Failed to compile.

C:/Users/.../src/provisions/components/documentation/add-plan-dialog/location/Location.tsx
TypeScript error in C:/Users/.../src/provisions/components/documentation/add-plan-dialog/location/Location.tsx(77,13):
Argument of type '{ x: any; y: any; }' is not assignable to parameter of type '(prevState: undefined) => undefined'.
  Object literal may only specify known properties, and 'x' does not exist in type '(prevState: undefined) => undefined'.  TS2345

    75 |         if (data && data.coordenadas.length > 0) {
    76 |           setDefaultCoordinates({
  > 77 |             x: data.coordenadas[0].coordX,
       |             ^
    78 |             y: data.coordenadas[0].coordY
    79 |           })
    80 |         }
Compiling...
Failed to compile.

C:/Users/.../src/provisions/components/documentation/operational-notif-document/operational-notif-document-dialog/content/Content.tsx
TypeScript error in C:/Users/.../src/provisions/components/documentation/operational-notif-document/operational-notif-document-dialog/content/Content.tsx(80,40):
Object is possibly 'undefined'.  TS2532

    78 |           document: [
    79 |             {
  > 80 |               nombre: innerDocument && innerDocument.name,
       |                                        ^
    81 |               extension: innerDocument && innerDocument.name.substring(innerDocument.name.indexOf('.'), innerDocument.name.length),
    82 |               tipoMime: innerDocument && innerDocument.type,
    83 |               carpeta: '/Documentos/ZEUDOCUWBS02',
```

wich we solved with this diffs:

```diff
diff --git a/src/provisions/components/documentation/add-plan-dialog/location/Location.tsx b/src/provisions/components/documentation/add-plan-dialog/location/Location.tsx
...
-  const [ defaultCoordinates, setDefaultCoordinates ] = useState()
+  const [defaultCoordinates, setDefaultCoordinates] = useState<any>()
...
diff --git a/src/provisions/components/documentation/operational-notif-document/operational-notif-document-dialog/content/Content.tsx b/src/provisions/components/documentation/operational-notif-document/operational-notif-document-dialog/content/Content.tsx
...
-  const [ innerDocument, setInnerDocument ] = useState()
+  const [innerDocument, setInnerDocument] = useState<any>()
...
```
After that the project compiles without TS errors.