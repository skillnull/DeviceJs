import type { VariableLibrary } from '../data/variable-library'
import { createBrowserMethods } from './methods/browser'
import { createDateMethods } from './methods/date'
import { createDeviceMethods } from './methods/device'
import { createEnvironmentMethods } from './methods/environment'
import { createGeoMethods } from './methods/geo'
import { createIdentityMethods } from './methods/identity'
import { createLoadingMethods } from './methods/loading'
import { createOsMethods } from './methods/os'
import { createUserAgentMethods } from './methods/user-agent'

export function createMethodLibrary (VariableLibrary: VariableLibrary, _window: any) {
  return {
    ...createLoadingMethods(),
    ...createIdentityMethods(),
    ...createDateMethods(VariableLibrary),
    ...createUserAgentMethods(VariableLibrary),
    ...createBrowserMethods(VariableLibrary, _window),
    ...createOsMethods(VariableLibrary),
    ...createDeviceMethods(VariableLibrary),
    ...createEnvironmentMethods(VariableLibrary),
    ...createGeoMethods()
  }
}

export type MethodLibrary = ReturnType<typeof createMethodLibrary>
