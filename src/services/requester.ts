import {IApi} from "./types";

function resolveParams(url: string, params: Record<string, any> | undefined): string {
  const authToken = localStorage.getItem('auth-token')
  const p = {...params, authToken,}
  return url + '?' + Object.keys(p).map(k => `${k}=${p[k]}`).join('&')
}

export default class Requester<T extends IApi> {
  url: string

  constructor(url: string) {
    this.url = url
  }

  post(payload: T['IReq']): Promise<T['IRes']> {
    return fetch(resolveParams(this.url, payload.params), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload.body)
    }).then(res => res.json())
  }

  patch(payload: T['IReq']): Promise<T['IRes']> {
    return fetch(resolveParams(this.url, payload.params), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload.body)
    }).then(res => res.json())
  }

  get(payload: T['IReq']): Promise<T['IRes']> {
    return fetch(resolveParams(this.url, payload.params), {
      method: 'GET',
    }).then(res => res.json())
  }
}
