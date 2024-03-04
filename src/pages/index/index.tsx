import { defineComponent, ref, watch } from 'vue';
import { getCurrentInstance,showToast, showLoading, hideLoading } from '@tarojs/taro';
import QrcodeVue from 'qrcode.vue/dist/qrcode.vue.esm';
import { getVisitorDetails, getQrcode } from '@/service';
import { useCountDown } from '@/hooks';
// import { useAuthStore } from '@/store';
// import { storeToRefs } from 'pinia';
import './index.scss';

export default defineComponent({
  name: 'VisitorDetails',
  components: { QrcodeVue },
  setup() {
    definePageConfig({
      navigationBarTitleText: '零洞访客邀约'
    });
    // console.log('0022220');
    const { start, counts, stop } = useCountDown(60);
    const data = ref<any>({});
    const statusMap = {
      1: '待访问',
      2: '已取消',
      3: '已取消',
      4: '访问结束',
      5: '访问中',
      6: '访问结束'
    };
    const codeValue = ref('');
    const { params } = getCurrentInstance().router as any;
    const getQrcodeFn = async () => {
      console.log(data.value, 'data.value');
      const getQrcodeData = await getQrcode<{ qrCodeStr: string }>({
        appointmentUid: data.value.id,
        projectUid: data.value.ownerProjectCode,
        qrCodeType: 2
      });
      if (!getQrcodeData.data) {
        showToast({
          title: '二维码返回信息有误',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      codeValue.value = getQrcodeData.data.qrCodeStr;

      stop();
      start();
    };
    const getVisitorDetailsFn = async () => {
      showLoading();
      try {
        const { data: resData } = await getVisitorDetails<any>(params.uuid);
        data.value = resData;
        getQrcodeFn();
        hideLoading();
      } catch (error) {
        console.log(error);
        hideLoading();
      }
    };
    getVisitorDetailsFn();

    watch(
      () => counts.value,
      val => {
        if (val === 0) {
          // start();
          getQrcodeFn();
        }
      }
    );
    const renderImgIcon = () => {
      if (data.value.visitorLogStatus === 5) {
        return <i class="i-custom-visiting5 text-160"></i>;
      }

      if ([2, 3, 4, 6].includes(data.value.visitorLogStatus)) {
        return <i class="i-custom-visiting6 text-160"></i>;
      }
      return <i class="i-custom-visiting text-160"></i>;
    };
    // const authStore = useAuthStore();
    // const { userInfo } = storeToRefs(authStore);
    return () => (
      <>
        {data.value && (
          <div class="visitorDetails-box">
            <div class={`head flex justify-between status-${data.value?.isShowQrCode ? 1 : 2}`}>
              <div class="text-wrap">
                <div class="status-text" v-show={data.value?.isShowQrCode}>
                  {data.value.visitorName}
                </div>
                {/* const statusMap = {
									1: '待访问',
									2: '已取消',
									3: '已取消',
									4: '访问结束',
									5: '访问中',
									6: '访问结束'
								}; */}
                <div v-show={!data.value?.isShowQrCode} class="status-text">
                  {/* {} */}
                  {new Date().getTime() < new Date(data.value.limitStartTime).getTime()
                    ? '暂未到访问时间'
                    : '邀约已结束'}
                  {/* {statusMap[data.value.visitorLogStatus]} */}
                </div>
                <div>欢迎到访 {data.value.ownerProjectName}</div>
              </div>
              {renderImgIcon()}
            </div>

            <div class="visitorDetails-content">
              {data.value?.isShowQrCode && (
                <div class="code-box">
                  <div class="m-b-4">出示二维码，快速通行 {data.value?.isShowQrCode}</div>

                  <qrcode-vue class="m-b-4" value={codeValue.value} size="165" level="L" />
                  <div class="down-box">
                    <span>{counts.value}s</span>后刷新二维码
                    <nut-icon
                      size="14"
                      name="refresh2"
                      onClick={() => {
                        stop();
                        // start();
                      }}
                    ></nut-icon>
                  </div>
                  <div v-show={data.value.visitorFacePic} class="face-text">
                    已录入人脸可刷脸通行
                  </div>
                </div>
              )}
              <div class="field-wrap">
                <div class="field-item flex">
                  <div>邀请人：</div>
                  <div>{data.value.ownerName}</div>
                </div>
                <div class="field-item flex">
                  <div>访客手机：</div>
                  <div>{data.value.visitorPhoneNo}</div>
                </div>
                <div class="field-item flex">
                  <div>访问时间：</div>
                  <div>{`${data.value.limitStartTime || ''}~${data.value.limitEndTime || ''}`}</div>
                </div>
                <div class="field-item flex">
                  <div>到访地址：</div>
                  <div>{data.value.ownerRoomAddress || '-'}</div>
                </div>
                <div class="field-item flex">
                  <div>到访目的：</div>
                  <div>{data.value.visitorReason}</div>
                </div>
                <div class="field-item flex">
                  <div>通行区域：</div>
                  <div>{data.value.passingAreaName || '-'}</div>
                </div>
                <div class="field-item flex">
                  <div>车辆车牌：</div>
                  <div>{data.value.visitorCarNo || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
});
