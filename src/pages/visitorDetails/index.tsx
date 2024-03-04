/* eslint-disable require-atomic-updates */
import { defineComponent, watch, reactive } from 'vue';
import { getCurrentInstance, reLaunch, showToast } from '@tarojs/taro';
import QrcodeVue from 'qrcode.vue/dist/qrcode.vue.esm';
// import 'jweixin-module';
// console.log(wx, 'wxxx')
// 引入pinia 报错
// import { useAuthStore } from '@/store';
import { useCountDown } from '@/hooks';
import { formateDate } from '@/utils';
import { getDetailVisirtor, accessauthVisitorGet } from '@/service/api';
// import msgVerification from '@/components/msgVerification';

import './index.scss';
export default defineComponent({
  name: 'Login',
  components: {
    QrcodeVue
  },
  setup() {
    definePageConfig({
      navigationBarTitleText: '访客详情'
    });
    const { start, counts, stop } = useCountDown(60);
    const { params } = getCurrentInstance().router as any;
    // wx.openLocation({
    //   name: '佛山碧桂园总部', // 位置名
    //   address: '佛山碧桂园总部', // 地址详情说明
    //   scale: 15 // 地图缩放级别,整型值,范围从1~28。默认为最大
    // });
    // const authStore = useAuthStore();
    // const isChecking = authStore.isChecking;
    //
    if (!(window as any).isChecking) {
      reLaunch({
        url: `/pages/index/index?uuid=${params.uuid}`
      });
    }
    const state = reactive({
      codeValue: '122',
      visitorLogStatusMap: {
        0: {
          name: '待审核',
          color: '#F5A623'
        },
        1: {
          name: '待访问',
          color: '#7ED321'
        },
        2: {
          name: '已取消',
          color: '#979797'
        },
        3: {
          name: '已驳回',
          color: '#D0021B'
        },
        4: {
          name: '超时未访问',
          color: '#979797'
        },
        5: {
          name: '正在访问',
          color: '#7ED321'
        },
        6: {
          name: '已结束',
          color: '#979797'
        }
      },
      data: {
        enterprise: '',
        visitorName: '',
        limitStartTime: '',
        limitEndTime: '',
        visitorLogStatus: 1,
        visitorReason: '',
        uuid: '',
        telephone: '',
        ownerRoomAddress: '',
        visitorPhoneNo: '',
        ownerProjectCode: '',
        noticeList: [],
        isShowQrCode: '',
        ownerName: ''
      }
    });

    const accessauthVisitorGetFn = async () => {
      const accessauthVisitorGetData = await accessauthVisitorGet<{ qrCodeStr: string }>({
        appointmentUid: params.uuid,
        projectUid: state.data.ownerProjectCode,
        qrCodeType: 2
      });
      if (!accessauthVisitorGetData.data) {
        showToast({
          title: '二维码返回信息有误',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      state.codeValue = accessauthVisitorGetData.data.qrCodeStr;

      stop();
      start();
    };
    watch(
      () => counts.value,
      val => {
        if (val === 0) {
          // start();
          accessauthVisitorGetFn();
        }
      }
    );
    const getDetailVisirtorFn = async () => {
      const getDetailVisirtorData = await getDetailVisirtor<any>({
        uuid: params.uuid
      });
      state.data = getDetailVisirtorData.data;

      accessauthVisitorGetFn();
    };

    getDetailVisirtorFn();
    return () => (
      <>
        <div class="visitorDetails">
          <div class="head-bg">
            {!state.data.isShowQrCode ? (
              <h1 class="mt-8">{state.visitorLogStatusMap[state.data!.visitorLogStatus].name}</h1>
            ) : (
              <>
                <h1>{state.data?.visitorName}</h1>
                <div>{state.data?.enterprise}</div>
              </>
            )}
          </div>
          <div class="content-box">
            {state.data?.isShowQrCode && (
              <div class="img-box">
                <div class="m-b-4">出示二维码，快速通行 {state.data?.isShowQrCode}</div>

                <qrcode-vue class="m-b-4" value={state.codeValue} size="250" level="L" />
                <div class="down-box">
                  <span>{counts.value}s后刷新二维码 </span>
                  <nut-icon
                    size="14"
                    name="refresh2"
                    onClick={() => {
                      stop();
                      // start();
                    }}
                  ></nut-icon>
                </div>
              </div>
            )}
            <div class="visitorDetails-content">
              <h2>访客信息</h2>
              <div class="form-item">
                <div>被访人</div>
                <div>{state.data?.ownerName || '-'}</div>
              </div>
              {/* <div class="form-item">
                <div>联系方式</div>
                <div>{state.data?.visitorPhoneNo}</div>
              </div> */}
              <div class="form-item">
                <div>访问时间</div>
                <div>
                  {formateDate(state.data?.limitStartTime as string)} ~{formateDate(state.data?.limitEndTime as string)}
                </div>
              </div>
              <div class="form-item">
                <div>访问地址</div>
                <div>{state.data.ownerRoomAddress || '-'}</div>
              </div>
              <div class="form-item">
                <div>到访目的</div>
                <div>{state.data?.visitorReason || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
});
