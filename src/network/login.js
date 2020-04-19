import {
  request
} from './request'

export function getLogin(form) {
  return request({
    url: '/login',
    method: 'post',
    data: form

  })
}