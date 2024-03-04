import { defineComponent } from 'vue';
import { getCurrentInstance } from '@tarojs/taro';
import { splitMobile } from '@/utils';
import msgVerification from '@/components/msgVerification';
import './index.scss';

export default defineComponent({
  name: 'Login',
  components: {
    msgVerification
  },
  setup() {
    const phone: string = getCurrentInstance()?.router?.params.phone as string;
    const key = 0;
    definePageConfig({
      navigationBarTitleText: '验证码登录'
    });
    return () => (
      <div class="login-box">
        {/* 不加这个dd小程序顶部会有留白 */}
        <div>&nbsp;</div>
        <div class="msg-head">
          <h3>请输入验证码</h3>
          <div>验证码已发送至 {splitMobile(18128289900, ' ')}</div>
        </div>
        <msgVerification key={key} />
      </div>
    );
  }
});
