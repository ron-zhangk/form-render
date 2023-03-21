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
    placeholder: {
      title: '组件提示信息(placeholder):',
      type: 'string',
      default: '请输入',
    },
    initAction: {
      title: '初始接口(initAction):',
      type: 'string',
      default: null,
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
    defaultRequire: {
      title: '是否必填(require)',
      type: 'boolean',
      default: true,
    },
    requireSet: {
      title: '组件是否必填配置',
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
                placeholder: '组件name',
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
    defaultHidden: {
      title: '组件隐藏（hidden）',
      type: 'boolean',
      default: false,
    },
    hiddenSet: {
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
                placeholder: '组件name',
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
  };
};

const fnGetObjValue = ({ item, _initData, _linkAction }: any) => {
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
    type: widget ?? 'input',
    label: title,
    name: name,
    desc: desc ?? '',
    placeholder: placeholder ?? '请输入',
    hidden: defaultHidden ?? false,
    require: defaultRequire ?? false,
    initAction: initAction ?? null,
    linkAction: _linkAction?.length ? _linkAction : null,
    initData: widget === 'select' ? _initData : initData,
    events: {
      hidden: hiddenSet?.enumList?.length ? hiddenSet : null,
      require: requireSet?.enumList?.length ? requireSet : null,
    },
  };
};

export { fnGetObjValue, commonSettings, settings };
