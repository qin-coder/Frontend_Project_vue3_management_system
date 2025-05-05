import request from '@/utils/request'

// register interface
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', {
    username,
    password,
    repassword
  })
//login interface
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', {
    username,
    password
  })

export const userGetInfoService = () => request.get('/my/userinfo')
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

export const userUploadAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
