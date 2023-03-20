import './styles.css';
import Generator from 'fr-generator';
import { useRef } from 'react';
import { Modal, message } from 'antd';
import { settings, fnGetObjValue } from '../utils/util';

const RormRender = () => {
  const ref = useRef<any>(null);

  const defaultValue = {
    type: 'object',
    properties: {
      pageData: {
        title: 'pageData数据',
        type: 'string',
        widget: 'textarea',
        commonSettings: {},
        setting: {
          aaa: {
            title: 'aaaa',
            type: 'string',
            default: '',
          },
        },
      },
      props: {
        commonSettings: {},
      },
    },
  };

  const fnInitData = ({ initAction, initDataObj, selectValue }: any) => {
    if (initAction) {
      return [];
    }

    if (!initDataObj?.initDataList?.length) {
      return null;
    }

    return initDataObj.initDataList.map((item: any) => ({
      ...item,
      selected: item?.code === selectValue ?? false,
    }));
  };

  const hasNoNameComponent = (components: any[]) => {
    return components.some((component: any) => !component.name);
  };

  const hasInvalidHiddenConfig = (hiddenConfigs: any[]) => {
    return hiddenConfigs.some((config: any) => !config.label || !config.value);
  };

  const onClick = () => {
    const val = ref?.current?.getValue();
    const properties = val?.properties || {};
    const components = Object.values(properties) || [];

    if (hasNoNameComponent(components)) {
      message.error('存在没有name的组件');
      return;
    }

    const hiddenSetConfigs = components.flatMap(
      (component: any) => component?.hiddenSet?.enumList ?? [],
    );
    if (hasInvalidHiddenConfig(hiddenSetConfigs)) {
      message.error('存在隐藏配置没填完整的组件');
      return;
    }
    const requireSetConfigs = components.flatMap(
      (component: any) => component?.requireSet?.enumList ?? [],
    );

    if (hasInvalidHiddenConfig(requireSetConfigs)) {
      message.error('存在是否必填配置没填完整的组件');
      return;
    }

    const arr = components.map((item: any) => {
      const { initDataObj, selectValue, widget, initAction, linkActionObj } = item;
      let _initData = null;
      let _linkAction: any = [];
      if (widget === 'select') {
        _initData = fnInitData({ initAction, initDataObj, selectValue });
      }
      if (linkActionObj?.linkAction) {
        _linkAction = linkActionObj.linkAction.map((v: any) => v.value);
      }
      return fnGetObjValue({ item, _initData, _linkAction });
    });

    Modal.info({
      title: 'JSON',
      content: (
        <div>
          <p>{JSON.stringify(arr)}</p>
        </div>
      ),
    });
  };

  return (
    <div style={{ height: '80vh' }}>
      <Generator
        ref={ref}
        // defaultValue={defaultValue}
        extraButtons={[{ text: '查看', onClick: () => onClick() }]}
        globalSettings={null}
        settings={settings()}
        commonSettings={{}}
      />
    </div>
  );
};

export default RormRender;
