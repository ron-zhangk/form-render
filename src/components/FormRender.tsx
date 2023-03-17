import './styles.css';
import Generator from 'fr-generator';
import { useRef } from 'react';
import { Modal, message, Input, Button } from 'antd';
import { commonSettings, settings, hidTypeMap, fnGetObjValue } from '../utils/util';

const RormRender = () => {
  const ref = useRef<any>(null);

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

  const fnGetHiddenVal = (props: any) => {
    const { addons } = props;
    const dependValues = addons?.dependValues?.[0] ?? {};
    const { enumList = [], linkType = 'add' } = dependValues;

    if (enumList.some((item: any) => !item?.label || !item?.value)) {
      message.error('存在组件隐藏配置没填的组件');
      return;
    }

    let hiddenValue = '';

    if (enumList?.length) {
      const conditions = enumList.map((item: any) => {
        const { label, value, setType } = item;
        return `formData.${label} ${hidTypeMap[setType]} "${value}"`;
      });

      if (enumList?.length === 1) {
        hiddenValue = `{{${conditions[0]}}}`;
      } else {
        const type = hidTypeMap[linkType];
        hiddenValue = `{{${conditions.join(` ${type} `)}}}`;
      }
    }

    props.onChange(hiddenValue);
    addons.setValueByPath('hidden', hiddenValue);
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

    const hiddenConfigs = components.flatMap((component: any) => component?.hidSet?.enumList ?? []);
    if (hasInvalidHiddenConfig(hiddenConfigs)) {
      message.error('存在组件隐藏配置没填的组件');
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

  const HiddenInput = (props: any) => {
    return (
      <div className="hidden-input-set">
        <Button type="primary" onClick={() => fnGetHiddenVal(props)}>
          点击获取hidden字段
        </Button>
        <Input disabled value={props?.value} onChange={props?.onChange} />
      </div>
    );
  };

  return (
    <div style={{ height: '80vh' }}>
      <Generator
        ref={ref}
        extraButtons={[{ text: '查看', onClick: () => onClick() }]}
        globalSettings={null}
        widgets={{ HiddenInput }}
        settings={settings()}
        commonSettings={commonSettings()}
      />
    </div>
  );
};

export default RormRender;
