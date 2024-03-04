import type { PropType } from 'vue';
import { defineComponent, reactive, ref, nextTick, watch } from 'vue';
import './index.less';
type Fetch = () => Promise<any>;
interface Props {
  label: string;
  value: string;
}
interface SelecteUserProps {
  multiple: boolean;
  props: Props;
  value: [];
  // userObj?: User<any>;
  fetch: Fetch;
}
// type User<T> = {
//   [P in keyof T]: T[P];
// };
// type Test = {
//   [key in string]?: any;
// };
interface State {
  show: boolean;
  searchValue: string;
  indeterminate: boolean;
  allSel: boolean;
  customHasMore: boolean;
  radioUser: string;
  selUserKey: any[];
  userList: any[];
  selUser: any[];
}
export default defineComponent({
  name: 'SelecteUser',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array as PropType<any>,
      default: () => []
    },
    // userObj: {
    //   type: Object as PropType<User<{}>>
    // },
    props: {
      type: Object as PropType<Props>,
      default: () => {
        return {
          label: 'name',
          value: 'userId'
        };
      }
    },
    fetch: {
      type: Function as PropType<Fetch>,
      default: () => {
        return new Promise(resolve => {
          resolve('sss');
        });
      }
    }
  },
  emits: ['update:value'],
  setup(props: SelecteUserProps, context: any) {
    const state = reactive<State>({
      show: false,
      searchValue: '',
      indeterminate: true,
      allSel: false,
      customHasMore: true,
      selUserKey: ['1', '2', '1000'], // 已选择用户key
      radioUser: '',
      userList: Array.from({ length: 100 }, (v, i) => {
        return {
          name: `用户${i}`,
          userId: String(i)
        };
      }),
      selUser: [
        {
          name: '用户1',
          userId: '1'
        },
        {
          name: '用户2',
          userId: '2'
        },
        {
          name: '用户1000',
          userId: '1000'
        }
      ]
    });
    const initUserData = () => {
      state.selUser = [...props.value];
      state.selUserKey = (props.value as []).map(_ => _[props.props.value]);
    };
    // initUserData();
    // watch(
    //   () => props.value,
    //   (newValue, oldValue) => {
    //     state.selUserKey = (newValue as []).map(_ => _[props.props.value]);
    //     state.selUser = newValue;
    //     console.log('watch value', newValue);
    //   },
    //   {
    //     immediate: true,
    //     deep: true
    //   }
    // );
    // watch(
    //   () => state.selUser,
    //   (newValue, oldValue) => {
    //     context.emit('update:value', state.selUser);
    //     console.log('watch selUser', newValue);
    //   },
    //   {
    //     immediate: true,
    //     deep: true
    //   }
    // );
    const open = () => {
      state.show = true;
      initUserData();
    };
    const onClose = () => {
      state.show = false;
    };
    const search = (val: string) => {
      console.log(val, '-----');
    };
    const checkboxgroupRef = ref(null);
    const changeCheckbox = async (val: string) => {
      await nextTick();
      const flag = state.selUserKey.some(_ => val === _);
      // flag 存在就是添加
      if (flag) {
        state.selUser = [...state.selUser, state.userList.find(_ => _[props.props.value] === val)];
      } else {
        state.selUser = state.selUser.filter(_ => _[props.props.value] !== val);
      }
    };
    // 多选渲染
    const renderMUserList = () => {
      return (
        <nut-checkboxgroup ref={checkboxgroupRef} vModel={state.selUserKey}>
          {state.userList.map(user => {
            return (
              <nut-cell key={user[props.props.value]}>
                <nut-checkbox
                  label={user[props.props.value]}
                  onChange={() => {
                    changeCheckbox(user[props.props.value]);
                  }}
                >
                  {user.name}
                </nut-checkbox>
              </nut-cell>
            );
          })}
        </nut-checkboxgroup>
      );
    };
    // 单选渲染
    const renderRUserList = () => {
      return (
        <nut-radiogroup
          vModel={state.radioUser}
          onChange={(val: string) => {
            state.selUser = [state.userList.find(_ => _[props.props.value] === val)];
            // context.emit('update:value', [state.userList.find(_ => _[props.props.value] === val)]);
          }}
        >
          {state.userList.map(user => {
            return (
              <nut-cell key={user[props.props.value]}>
                <nut-radio label={user[props.props.value]}>{user[props.props.label]}</nut-radio>
              </nut-cell>
            );
          })}
        </nut-radiogroup>
      );
    };
    // 全选和取消全选
    const changeAll = (value: boolean) => {
      state.indeterminate = false;
      (checkboxgroupRef as any).value.toggleAll(value);
      state.selUser = value ? state.userList : [];
      // if (value) {
      //   // const obj = {};
      //   // const arr: User[] = [];
      //   // [...state.selUser, ...state.userList].forEach(user => {
      //   //   if (!obj[user.userId]) {
      //   //     arr.push(user);
      //   //   }
      //   // });
      //   state.selUser = state.userList;
      // } else {
      //   state.selUser = [];
      // }
      // console.log(e, 'ee');
    };
    const loadMore = (done: any) => {
      state.customHasMore = false;
      console.log('loadMore');
      done();
    };
    const renderUserList = () => {
      const { multiple } = props;
      return (
        <div class="user-list-wrap">
          <nut-cell-group>
            <div id="refreshScroll" style={{ height: `calc(100vh - 50px - ${multiple ? '130px' : '78px'})` }}>
              <nut-infiniteloading
                container-id="refreshScroll"
                load-more-txt="没有啦～"
                load-txt="加载中..."
                load-icon={'loading'}
                has-more={state.customHasMore}
                onLoadMore={loadMore}
              >
                {multiple ? renderMUserList() : renderRUserList()}
              </nut-infiniteloading>
            </div>
          </nut-cell-group>
        </div>
      );
    };
    context.expose({ open });
    return () => {
      return (
        <nut-popup visible={state.show} position={'right'} onClose={onClose} z-index="9999">
          <div class="selecteUser-wrap">
            {/* 搜索 */}
            <nut-searchbar
              background="#ddd"
              vModel={state.searchValue}
              onChange={(val: string) => {
                console.log(val, 'ppp');
                // state.searchValue = val;
              }}
              onSearch={search}
              v-slots={{
                leftin: () => {
                  return <nut-icon size="14" name="search2"></nut-icon>;
                }
              }}
            />
            {/* 用户列表渲染 */}
            {renderUserList()}
            {/* 底部 */}
            <div class="selecteUser-footer">
              {props.multiple && (
                <div class="footer-selected">
                  已选：{state.selUser.length} 人{' '}
                  <nut-tag
                    type="primary"
                    onClick={() => {
                      state.selUser = [];
                      state.selUserKey = [];
                    }}
                  >
                    清空
                  </nut-tag>
                  {/* {state.selUser.map(user => {
                  return (
                    <nut-tag
                      type="primary"
                      closeable
                      onClose={() => {
                        state.selUserKey = state.selUserKey.filter(_ => _ !== user.userId);
                        state.selUser = state.selUser.filter(_ => _.userId !== user.userId);
                      }}
                    >
                      {user.name}
                    </nut-tag>
                  );
                })} */}
                </div>
              )}
              <div class="footer-btns">
                <nut-button
                  size="small"
                  onClick={() => {
                    state.show = false;
                  }}
                >
                  取消
                </nut-button>
                <nut-button
                  size="small"
                  type="primary"
                  onClick={() => {
                    context.emit('ok', state.selUser);
                    context.emit('update:value', state.selUser);
                    state.show = false;
                  }}
                >
                  确定
                </nut-button>
              </div>
            </div>
          </div>
        </nut-popup>
      );
    };
  }
});
