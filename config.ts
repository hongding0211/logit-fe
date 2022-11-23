export const baseUrl = 'http://127.0.0.1:4000'

export const APIS = {
  GET_API_SYSTEMS: `${baseUrl}/api/systems`,
  GET_API_LOGS: `${baseUrl}/api/logs`,
}

export const SECRET = 'linmeihuashiyigemeimao'

export const SSO_HOST = 'https://hong97.ltd/sso'
export const SSO_REDIRECT = SSO_HOST + '/login?client=' + encodeURIComponent(`${document.location.href}`)
