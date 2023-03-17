const settings = () => {
  return [
    {
      title: '组件选择',
      widgets: [
        {
          text: '简单输入框',
          name: 'I',
          schema: {
            title: '输入框',
            type: 'string',
            widget: 'input',
          },
          setting: {
            initData: {
              title: '组件初始值（initData）',
              type: 'string',
              default: '',
            },
          },
        },
        {
          text: '下拉单选',
          name: 'S',
          schema: {
            title: '下拉单选',
            type: 'string',
            widget: 'select',
          },
          setting: {
            initDataObj: {
              title: '组件初始值（initData）',
              type: 'object',
              properties: {
                initDataList: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      code: {
                        placeholder: 'code（单个值的code）',
                        title: 'code',
                        type: 'string',
                      },
                      name: {
                        placeholder: 'name(单个值的name)',
                        title: 'name',
                        type: 'string',
                      },
                    },
                  },
                  props: {
                    hideCopy: true,
                    hideMove: true,
                  },
                  default: [],
                  widget: 'simpleList',
                },
              },
            },
            selectValue: {
              title: '组件处于选中的code(initData里select为true的)：',
              type: 'string',
              defaultValue: '',
            },
          },
        },
      ],
    },
  ];
};

const commonSettings = () => {
  return {
    name: {
      title: '组件名称（name）:',
      type: 'string',
    },
    title: {
      title: 'label展示（label）:',
      type: 'string',
      widget: 'htmlInput',
    },
    desc: {
      title: '描述(desc):',
      type: 'string',
      default: '',
    },
    initAction: {
      title: '初始接口(initAction):',
      type: 'string',
      default: null,
    },
    placeholder: {
      title: '组件提示信息(placeholder):',
      type: 'string',
      default: '请输入',
    },
    require: {
      title: '是否必填(require)',
      type: 'boolean',
      default: true,
    },
    nullNotVisible: {
      title: '是否显示(nullNotVisible)',
      type: 'boolean',
      default: false,
    },
    linkActionObj: {
      title: '联动接口(linkAction)',
      type: 'object',
      properties: {
        linkAction: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              value: {
                type: 'string',
                className: 'link-action',
              },
            },
          },
          props: {
            hideCopy: true,
            hideMove: true,
          },
          default: [],
          widget: 'simpleList',
        },
      },
    },
    hidSet: {
      title: '组件隐藏配置',
      type: 'object',
      properties: {
        linkType: {
          title: '多组件组合类型',
          type: 'string',
          widget: 'radio',
          props: {
            options: [
              { label: '&&', value: 'and' },
              { label: '||', value: 'or' },
            ],
          },
          default: 'and',
        },
        enumList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: {
                placeholder: '组件id',
                type: 'string',
              },
              setType: {
                type: 'string',
                enum: ['equal', 'unequal'],
                enumNames: ['===', '!=='],
                default: 'equal',
                widget: 'select',
              },
              value: {
                placeholder: '组件value',
                type: 'string',
              },
            },
          },
          props: {
            hideCopy: true,
            hideMove: true,
          },
          default: [],
          widget: 'simpleList',
        },
      },
    },
    hidden: {
      title: '组件隐藏（hidden）:',
      type: 'string',
      widget: 'HiddenInput',
      dependencies: ['hidSet'],
    },
  };
};

const fnGetObjValue = ({ item, _initData, _linkAction }: any) => {
  const { hidden, title, widget, initData = null, hidSet } = item;
  return {
    desc: item?.desc ?? '',
    initAction: item?.initAction ?? null,
    nullNotVisible: item?.nullNotVisible ?? false,
    placeholder: item?.placeholder ?? '请输入',
    require: item?.require ?? false,
    type: widget ?? 'input',
    label: title,
    hidden: hidden ? hidSet : null,
    initData: widget === 'select' ? _initData : initData,
    linkAction: _linkAction?.length ? _linkAction : null,
  };
};

const hidTypeMap: any = {
  and: '&&',
  or: '||',
  equal: '===',
  unequal: '!==',
};

export { fnGetObjValue, commonSettings, settings, hidTypeMap };
