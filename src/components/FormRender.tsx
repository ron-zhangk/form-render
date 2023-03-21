import './styles.css';
import Generator from 'fr-generator';
import { useRef, useState } from 'react';
import { Modal, message, Input, Button } from 'antd';
import ReactJson from 'react-json-view';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { settings, commonSettings, fnGetObjValue, isJson } from '../utils/util';

const { TextArea } = Input;

const RormRender = () => {
  const [areaData, setAreaData] = useState('');
  const [pageData, setPageData] = useState({});

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

  const hasNoNameComponent = (components: any[]) => {
    return components.some((component: any) => !component.name);
  };

  const hasInvalidHiddenConfig = (hiddenConfigs: any[]) => {
    return hiddenConfigs.some((config: any) => !config.label || !config.value);
  };

  const handleTextAreaChange = (e: any) => {
    setAreaData(e?.target?.value);
  };

  const onBtnClick = () => {
    let _pageData = areaData.replace(/'/g, '"');
    _pageData = _pageData ? _pageData : '{}';
    const flag = isJson(_pageData);
    if (!flag) {
      message.error('JSON格式不对！');
      return;
    }
    const data = JSON.parse(_pageData);
    setPageData(data);
  };

  const onCheckClick = () => {
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
    const configData = {
      elements: arr,
      pageData,
    };

    Modal.info({
      width: '500px',
      title: 'JSON',
      okText: renderUrlCopy(configData),
      content: (
        <div style={{ maxHeight: '500px', overflow: 'auto' }}>
          <ReactJson src={configData} />
        </div>
      ),
    });
  };

  const renderUrlCopy = (configData: any) => {
    return (
      <CopyToClipboard text={JSON.stringify(configData)}>
        <div onClick={() => message.success('复制成功！')} style={{ cursor: 'pointer' }}>
          {'复制'}
        </div>
      </CopyToClipboard>
    );
  };

  return (
    <div style={{ height: '60vh' }}>
      <Generator
        ref={ref}
        extraButtons={[
          {
            text: '查看JSON结果',
            className: 'ant-btn-primary check-btn',
            onClick: () => onCheckClick(),
          },
        ]}
        globalSettings={null}
        settings={settings()}
        commonSettings={commonSettings()}
      />
      <Button type="primary" className="check-json" onClick={onBtnClick}>
        展示JSON
      </Button>
      <p className="description">输入json数据后点击展示JSON按钮查看数据</p>
      <TextArea
        rows={4}
        allowClear
        onChange={handleTextAreaChange}
        placeholder="输入pageData数据"
        style={{ display: 'flex', width: '500px', marginLeft: '200px' }}
      />
      <ReactJson
        src={pageData}
        name={'pageData'}
        style={{ marginLeft: '250px', textAlign: 'left' }}
      />
    </div>
  );
};

export default RormRender;
