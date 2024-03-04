import { defineStore } from 'pinia';
import { getUserInfo, getToken, clearAuthStorage, setToken, setUserInfo } from '@/utils';

interface AuthState {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  token: string;
  /** 是否短信校验 */
  isChecking: boolean;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    token: getToken(),
    isChecking: false
  }),
  getters: {
    /** 是否登录 */
    isLogin: state => Boolean(state.token)
  },
  actions: {
    setIsChecking(isChecking: boolean) {
      console.log(this, 'this');
      this.isChecking = isChecking;
    },
    /** 设置token */
    setToken(token: string) {
      setToken(token);
    },
    /** 设置token */
    setUserInfo(userInfo: Auth.UserInfo) {
      setUserInfo(userInfo);
    },
    /** 重置auth状态 */
    resetAuthStore() {
      clearAuthStorage();
      this.$reset();
    }
  }
});
