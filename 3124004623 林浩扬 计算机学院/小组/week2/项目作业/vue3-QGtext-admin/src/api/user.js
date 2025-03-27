import request from '@/utils/request'

//注册接口
export const userRegisterSevice = ({ username, message, phone, password, confirmpassword }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user',
    data: {
      username,
      message,
      phone,
      password,
      confirmpassword
    }
  });
};

//登录接口
export const userLoginSevice = ({ username, password }) =>
  request.post('/api/login', { username, password})

