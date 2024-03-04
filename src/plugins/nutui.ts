import type { App } from 'vue';
import { Icon } from '@nutui/nutui-taro';

/** 定制化主题必须使用 scss */
// import '@nutui/nutui-taro/dist/styles/themes/default.scss';

export default function setupNutui(app: App<Element>) {
  app.use(Icon);
}
