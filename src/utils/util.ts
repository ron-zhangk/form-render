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
    initData = null,
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
    initData: widget === 'select' ? _initData : initData,
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

const fnGetAtributes = (attributes: any) => {
  let data = attributes.replace(/'/g, '"');
  const flag = isJson(data);
  return flag ? JSON.parse(data) : null;
};

export {
  fnGetObjValue,
  isJson,
  fnInitData,
  hasNoNameComponent,
  hasInvalidHiddenConfig,
  fnGetAtributes,
};
