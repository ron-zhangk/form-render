import { keyBy, isNaN } from 'lodash';
import unique from 'simple-unique';

const fnGetObjValue = ({ item, _initData, _linkAction, _attributes }: any) => {
  const {
    name,
    desc,
    placeholder,
    defaultHidden,
    defaultRequire,
    initAction,
    title,
    widget,
    hiddenSet,
    requireSet,
  } = item;
  return {
    type: widget === 'date' ? 'datePicker' : widget || 'input',
    label: title,
    name: name,
    desc: desc ?? '',
    placeholder: placeholder ?? '请输入',
    hidden: defaultHidden ?? false,
    require: defaultRequire ?? false,
    initAction: initAction ?? null,
    attributes: _attributes ?? null,
    linkAction: _linkAction?.length ? _linkAction : null,
    initData: _initData ?? null,
    events: {
      hidden: hiddenSet?.enumList?.length ? hiddenSet : null,
      require: requireSet?.enumList?.length ? requireSet : null,
    },
  };
};

const isJson = (str: any) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        console.log('是JSON');
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  } else {
    console.log('not string');
  }
};

const fnInitData = (props: any) => {
  const { widget, initData, initAction, initDataObj, selectValue } = props;
  switch (widget) {
    case 'select':
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
    case 'date':
      return initData && !isNaN(Number(initData)) ? Number(initData) : null;
    default:
      return initData;
  }
};

const hasNoNameComponent = (components: any[]) => {
  return components.some((component: any) => !component.name);
};

const hasInvalidHiddenConfig = (hiddenConfigs: any[]) => {
  return hiddenConfigs.some((config: any) => !config.label || !config.value);
};

const fnGetAtributes = (attributes: any) => {
  let data = attributes.replace(/'/g, '"');
  const flag = isJson(data);
  return flag ? JSON.parse(data) : null;
};

const fnGetImportData = (schemaForImportData: any) => {
  const { elements = [] } = schemaForImportData;
  return {
    type: 'object',
    properties: keyBy(
      elements.map(({ initData, type, events, linkAction, ...others }: any) => {
        const params = {
          ...others,
          title: others.label,
          widget: type === 'datePicker' ? 'date' : type || 'input',
          type: 'string',
          defaultHidden: others.hidden,
          defaultRequire: others.require,
          linkActionObj: { linkAction: linkAction?.map((v: any) => ({ value: v })) },
          hiddenSet: {
            linkType: events?.hidden?.linkType || 'and',
            enumList: events?.hidden?.enumList || [],
          },
          requireSet: {
            linkType: events?.require?.linkType || 'and',
            enumList: events?.require?.enumList || [],
          },
          UUID: `${type.charAt(0).toUpperCase()}_${unique(6)}`,
        };
        if (type === 'select') {
          const selectData = initData?.find((v: any) => v?.selected);
          params.selectValue = selectData?.code;
          params.initDataObj = { initDataList: initData || [] };
        } else {
          params.initData = initData || '';
        }
        return params;
      }),
      'UUID',
    ),
  };
};

export {
  fnGetObjValue,
  isJson,
  fnInitData,
  hasNoNameComponent,
  hasInvalidHiddenConfig,
  fnGetAtributes,
  fnGetImportData,
};
