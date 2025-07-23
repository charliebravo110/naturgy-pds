// facade for capacitor preferences plugin, to be used instead of localstorage, formerly known as capacitor storage. https://capacitorjs.com/docs/apis/preferences

import { Preferences } from '@capacitor/preferences'

export async function getPreferences(key: string) {
  return (await Preferences.get({ key })).value
}

export async function setPreferences(key: string, value: string) {
  return await Preferences.set({ key, value })
}

export async function removePreferences(key: string) {
  return await Preferences.remove({ key })
}

export async function clearPreferences() {
  return await Preferences.clear()
}
