import * as fs from "fs"
import * as path from "path";

export interface Config{
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

const configPath = path.join('unprefixed-intl.config.json')

let aConfig:Config;
if (fs.existsSync(configPath)){
    try{
        const requireResult = JSON.parse(fs.readFileSync(configPath,'utf-8')) as Config;
        if (requireResult.messagesPath===undefined||requireResult.messagesPath==null||
            requireResult.defaultLang===undefined||requireResult.defaultLang==null||
            requireResult.maxAcceptedLanguageSearch===undefined||requireResult.maxAcceptedLanguageSearch==null||
            requireResult.allowLanguageCode===undefined||requireResult.allowLanguageCode==null) {
            throw new Error(" missing some property: " + requireResult)
        }
        aConfig = requireResult;
    }catch (err){
        console.log("failed to read config from "+configPath+", cause: "+err)
    }
}
if (!aConfig){
    let withSrc = path.resolve('src/messages')
    let withoutSrc = path.resolve('messages')
    if (fs.existsSync(withSrc)){
        aConfig = {
            messagesPath: withSrc,
            defaultLang: 'en',
            maxAcceptedLanguageSearch: 3,
            allowLanguageCode: true
        }
    }else{
        aConfig = {
            messagesPath: withoutSrc,
            defaultLang: 'en',
            maxAcceptedLanguageSearch: 3,
            allowLanguageCode: true
        }
    }
}
export const config:Config = aConfig