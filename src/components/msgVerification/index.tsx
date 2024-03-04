import { defineComponent, ref, reactive, computed, watch } from 'vue';
import { useCountDown } from '@/hooks';
import './index.scss';
interface msgProps {
  showPhone?: boolean;
}
export default defineComponent({
  name: 'MsgVerification',
  props: {
    showPhone: {
      type: Boolean,
      default: false
    }
  },
  setup(props: msgProps, context: any) {
    const showNumberkeyboard = ref(false);
    const state = reactive({
      form: {
        phone: '',
        msg: '',
        checked: true
      },
      msgList: new Array<string>(6).fill(''),
      visible: true
    });

    const disabled = computed(() => {
      if (state.form.phone) return false;
      return true;
    });

    const active = computed(() => {
      return state.msgList.findIndex(item => !item);
    });
    watch(
      () => active.value,
      val => {
        if (val === -1) {
          context.emit('checkMsg', state.msgList.join(''));
        }
        console.log(val, 'vasssss');
        console.log(state.msgList.join(''), '0000000');
      }
    );
    const renderPhone = () => {
      return (
        <>
          <div class="phone-box">
            <div class="sel-num">
              +86 <div class="i-custom-drop-down"></div>
            </div>
            <div>
              <input
                type="number"
                value={state.form.phone}
                onInput={(e: Event) => {
                  state.form.phone = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
          </div>
          <div class="checkbox-box">
            <nut-checkbox vModel={state.form.checked}>
              <span>我已同意《零洞服务协议》</span>
            </nut-checkbox>
            <nut-button
              size="large"
              disabled={disabled.value}
              type="primary"
              onClick={() => {
                context.emit('SendMsg', state.form.phone);
              }}
            >
              获取验证码
            </nut-button>
          </div>
        </>
      );
    };
    // 验证码输入
    const inputMsg = (val: string) => {
      if (active.value === -1) return;
      console.log(val, 'vall');
      state.msgList[active.value] = String(val);
    };

    const deleteMsg = () => {
      const str = state.msgList.join('');
      const msgList = str.slice(0, str.length - 1).split('');
      state.msgList.forEach((item: any, i: number) => {
        if (!msgList[i] && Number(msgList[i]) !== 0) {
          state.msgList[i] = '';
        }
      });
    };
    const { start, counts } = useCountDown(60);
    start();
    const renderMsg = () => {
      const rendertimeBox = () => {
        if (counts.value === 0) {
          return (
            <div class="time-box">
              <span
                class="text-blue"
                onClick={() => {
                  context.emit('reset', start);
                }}
              >
                重新发送
              </span>
            </div>
          );
        }
        return (
          <div class="time-box">
            <span>{counts.value}s</span>重新发送
          </div>
        );
      };
      return (
        <>
          <div
            class="input-list"
            onClick={() => {
              showNumberkeyboard.value = true;
            }}
          >
            {state.msgList.map((item, i) => {
              return <span class={`input-item ${active.value === i ? 'active' : ''}`}>{item}</span>;
            })}
          </div>
          {rendertimeBox()}
          <nut-numberkeyboard
            visible={showNumberkeyboard.value}
            onInput={inputMsg}
            onDelete={deleteMsg}
            onClose={() => {
              showNumberkeyboard.value = false;
            }}
          />
        </>
      );
    };

    if (!props.showPhone) {
      showNumberkeyboard.value = true;
    }
    return () => <div class="msgVerification-box">{props.showPhone ? renderPhone() : renderMsg()}</div>;
  }
});
