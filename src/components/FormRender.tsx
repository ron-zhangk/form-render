import Generator, { fromSetting } from 'fr-generator';
import { useRef, useState } from 'react';
import { Modal, message, Input, Button } from 'antd';
import ReactJson from 'react-json-view';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { commonSettings, settings } from '../elements/settings';
import {
  fnGetObjValue,
  isJson,
  fnInitData,
  hasNoNameComponent,
  hasInvalidHiddenConfig,
  fnGetAtributes,
  fnGetImportData,
} from '../utils/util';
import styles from './FormRender.module.less';

const { TextArea } = Input;

const RormRender = () => {
  const [areaData, setAreaData] = useState('');
  const [pageData, setPageData] = useState({});
  const [schemaForImport, setSchemaForImport] = useState('');
  const [show, setShow] = useState(false);

  const ref = useRef<any>(null);

  const handleTextAreaChange = (e: any) => {
    setAreaData(e?.target?.value);
  };

  const onBtnClick = () => {
    let _pageData = areaData.replace(/'/g, '"');
    _pageData = _pageData ? _pageData : '{}';
    const flag = isJson(_pageData);
    if (!flag) {
      message.error('pageData的JSON格式不对！');
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
      const { linkActionObj, attributes } = item;
      let _initData = null;
      let _linkAction: any = [];
      let _attributes: any = null;
      if (linkActionObj?.linkAction) {
        _linkAction = linkActionObj.linkAction.map((v: any) => v.value);
      }
      if (attributes) {
        _attributes = fnGetAtributes(attributes);
      }
      _initData = fnInitData(item);
      return fnGetObjValue({ item, _initData, _linkAction, _attributes });
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

  const handleImportTextareaChange = (e: any) => {
    setSchemaForImport(e?.target?.value);
  };

  const handleImportOk = () => {
    let schemaForImportData = schemaForImport.replace(/'/g, '"');
    schemaForImportData = schemaForImportData ? schemaForImportData : '{}';
    const flag = isJson(schemaForImportData);
    if (!flag) {
      message.error('格式不对哦，请重新尝试！');
      return;
    }
    const _data = JSON.parse(schemaForImportData);
    const { pageData = {} } = _data;
    const importData = fnGetImportData(_data);
    const value = fromSetting(importData);
    ref?.current?.setValue(value);
    setAreaData(JSON.stringify(pageData));
    setShow(!show);
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
    <div style={{ height: '60vh' }} className={styles['form_render_wrapper']}>
      <Generator
        ref={ref}
        extraButtons={[
          {
            text: '导入JSON',
            className: 'check-btn',
            onClick: () => setShow(!show),
          },
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
        value={areaData}
        onChange={handleTextAreaChange}
        placeholder="输入pageData数据"
        style={{ display: 'flex', width: '500px', marginLeft: '200px' }}
      />
      <ReactJson
        src={pageData}
        name={'pageData'}
        style={{ marginLeft: '250px', textAlign: 'left' }}
      />
      <Modal
        visible={show}
        title="导入"
        okText={'导入'}
        cancelText={'取消'}
        onOk={handleImportOk}
        onCancel={() => setShow(!show)}>
        <TextArea
          style={{ fontSize: 12 }}
          value={schemaForImport}
          placeholder={'请输入'}
          onChange={handleImportTextareaChange}
          autoSize={{ minRows: 10, maxRows: 30 }}
        />
      </Modal>
    </div>
  );
};

export default RormRender;
