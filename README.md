# next-unprefixed-intl
unprefixed-intl wrapper for Next.js

`https://petalfan.com`  => `en` url

`https://petalfan.com`  => `es` url

`https://petalfan.com`  => `en-GB` url

the translations will be read on the server side, in the example of this README using [Accept Language Header](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Language)

# Usage
Add an `unprefixed-intl.config.json` file to the project root:
```json
{
  "messagesPath": "/src/messages",
  "defaultLang": "en",
  "maxAcceptedLanguageSearch": 3,
  "allowLanguageCode": true
}
```

That will result in the interface (will be used by the package):
```typescript
interface Config{
    /** Path for the `messages` folder, that will alloc the .json files with the translations, (en-US.json, ...) */
    messagesPath:string,
    /** The default language, that will be used if the preferred language was not found */
    defaultLang:string,
    /** From the list of preferred languages a loop will be run to look for the best match available, this is the
     * limit of iterations this loop can do */
    maxAcceptedLanguageSearch:number
    /** If true: if the complete code is not found, the language code can be used instead, e.g. if the preferred
     * language is `en-US`, but there is no `en-US.json` file but rather a ` en.json`, it will be used */
    allowLanguageCode:boolean
}
```

Add the translation files inside the `messagesPath` directory:

`en` language example: `/src/messages/en.json`
```json
{
  "Home.component1": {
    "hello_message": "Hello! Welcome!",
    "phrase": "I just got my driver's license, and now I need to get gas for my truck. In the fall, I'll enroll in college, and I'll make sure to check the schedule of my favorite soccer team."
  },
  "Home.component2": {
    "popup.warning_message": "Remember that the default translation file, defined in `defaultLang`, must exist!"
  }
}
```
`es` language example: `/src/messages/es.json`
```json
{
  "Home.component1": {
    "hello_message": "¡Hola! ¡Sea bienvenido!",
    "phrase": "Acabo de obtener mi licencia de conducir y ahora necesito gasolina para mi camión. En el otoño, me inscribiré en la universidad y me aseguraré de consultar el calendario de mi equipo de fútbol favorito."
  },
  "Home.component2": {
    "popup.warning_message": "Recuerde que el archivo de traducción predeterminado, definido en `defaultLang`, ¡debe existir!"
  }
}
```
`en-GB` language example: `/src/messages/en-GB.json`
```json
{
  "Home.component1": {
    "hello_message": "Hello! Welcome!",
    "phrase": "I've just got my driving licence, and now I need to get petrol for my lorry. In the autumn, I'll enrol in university, and I'll make sure to check the timetable of my favourite football team."
  },
  "Home.component2": {
    "popup.warning_message": "Remember that the default translation file, defined in `defaultLang`, must exist!"
  }
}
```

# In the place you want to read the translations:
this example is using Next.js, but it can be in any Node.js project if you use [the original package](https://www.npmjs.com/package/unprefixed-intl/):

`/src/app/page.tsx`
```typescript jsx

import { getTranslations } from "next-unprefixed-intl"

export default function Home() {
    /*
    here you will receive the function that returns the 
    translations, based on a path (`"Home.component1"`), 
    and with the accept language header provided by the 
    "next/headers" import
     */
    const t = getTranslations("Home.component1")

    return (
        <p>{t("hello_message")}</p>
    )
}
```

# In addition
You can use `generate` to generate files based in translations api, in that example, the [Google Cloud Translate api](https://www.npmjs.com/package/@google-cloud/translate)
```typescript
import { generate } from "next-unprefixed-intl"
import { v2 } from "@google-cloud/translate"

const CREDENTIALS = JSON.parse(/*secret, check the Google Cloud Translation api for more info*/)

const translate = new v2.Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id,
})

async function translateTextFromSource(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
) {
    const [response] = await translate.translate(text, {
        from: sourceLanguage,
        to: targetLanguage,
    })
    return response
}

const fromLanguage = "en"
generate(
    fromLanguage,
    [
        //["en", "en"], // English
        ["zh", "zh"], // Chinese Mandarin
        ["hi", "hi"], // Hindi
        ["es", "es"], // Spanish
        ["fr", "fr"], // French
        ["ar", "ar"], // Arabic
        ["bn", "bn"], // Bengali
        ["ru", "ru"], // Russian
        ["pt-BR", "pt"], // Portuguese from Brazil
        ["pt-PT", "pt-PT"], // Portuguese from Portugal
        ["pt", "pt"], // Portuguese
        ["id", "id"], // Indonesian
        ["de", "de"], // German
        ["ja", "ja"], // Japanese
        ["ur", "ur"], // Urdu
        ["it", "it"], // Italian
        ["ko", "ko"], // Korean
        ["tr", "tr"], // Turkish
        ["vi", "vi"], // Vietnamese
        ["pl", "pl"], // Polish
        ["jv", "jv"], // Javanese
        ["pa", "pa"], // Punjabi
    ],
    (text, to) => translateTextFromSource(text, fromLanguage, to),
    (to) => {
        console.log(`Successfully generated ${to} translations.`)
        return true
    },
    (error) => {
        console.error("Error during translation:", error)
        return false
    },
)
```

You can use `bestAvailableOption` to read the preferred language, in this example the preferred language will be used to change the html language
```typescript jsx
import { bestAvailableOption } from "next-unprefixed-intl"

...
<html lang={bestAvailableOption()}>
...
```