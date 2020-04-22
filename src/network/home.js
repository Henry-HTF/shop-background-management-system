import {
  request
} from './request'

export function getMenuList() {
  return request({
    url: '/menus',
    method: 'get',
    
  })
}

export function getUsersList(query,pagenum,pagesize) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

export function getUserState(id, type) {
  return request({
    url: "users/"+ id +"/state/"+ type,
    method: 'put',
    data: {
      id,
      type
    }
  })
}

export function addNewUser(username,password,email,mobile) {
  return request({
    url: '/users',
    method: 'post',
    data: {
      username,
      password,
      email,
      mobile
    }
  })
}

export function queryUser(id) {
  return request({
    url: '/users/' + id,
    method: 'get',
    params: {
      id,
    }
  })
}

export function editUser(id,email,mobile) {
  return request({
    url: '/users/' + id,
    method: 'put',
    data: {
      email,
      mobile
    }
  })
}

export function deleteUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete',
  })
}