import Generator, {
  defaultCommonSettings,
  defaultGlobalSettings,
  defaultSettings,
} from 'fr-generator';
import { useRef } from 'react';
import './styles.css';
import { Modal, message, Input, Button } from 'antd';
import { fnHidden, fnInitData } from '../utils/util';

const NewWidget = ({ value = 0, onChange }: any) => (
  <button onClick={() => onChange(value + 1)}>{value}</button>
);

const RormRender = () => {
  // console.log(defaultSettings, defaultCommonSettings, defaultGlobalSettings);
  const ref = useRef<any>(null);

  const onClick = () => {
    const val = ref?.current?.getValue();
    const properties = val?.properties || {};
    const v = Object.values(properties) || [];
    const noName = v?.find((k: any) => !k.name);
    if (noName) {
      message.error('存在没有name的组件');
      return;
    }
    let arr: any = [];
    v?.map((item: any) => {
      const {
        enum: _enum = [],
        enumNames = [],
        hidden,
        selectValue,
        title,
        widget,
        initData = null,
        initAction,
        linkAction,
        hiddenType,
        ...others
      } = item;
      let _initData = null;
      let _linkAction: any = [];
      let hObj: any = { hiddenType, values: null };
      if (widget === 'select') {
        _initData = fnInitData({ initAction, _enum, enumNames, selectValue });
      }
      if (hidden) {
        hObj = fnHidden({ hidden, properties, hiddenType });
        console.log('harr====', hObj);
      }
      if (linkAction) {
        linkAction?.map((v: any) => {
          _linkAction.push(v?.value);
        });
      }
      let obj = {
        ...others,
        label: title,
        type: widget ?? 'input',
        initAction,
        hidden: hObj,
        initData: widget === 'select' ? _initData : initData,
        linkAction: _linkAction?.length ? _linkAction : null,
      };
      arr.push(obj);
    });

    Modal.info({
      title: 'JSON',
      content: (
        <div>
          <p>{JSON.stringify(arr)}</p>
        </div>
      ),
    });
    console.log('obj----------------', arr);
  };

  const aa = () => {
    return <Button />;
  };

  const settings = [
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
            enumList: {
              title: '组件初始值（initData）',
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  value: {
                    placeholder: 'code（单个值的code）',
                    title: 'code',
                    type: 'string',
                  },
                  label: {
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
            selectValue: {
              title: '组件处于选中的code(initData里select为true的)',
              type: 'string',
              defaultValue: '',
            },
          },
        },
      ],
    },
  ];

  const commonSettings = {
    name: {
      title: '组件名称（name）',
      type: 'string',
    },
    title: {
      title: 'label展示（label）',
      type: 'string',
      widget: 'htmlInput',
    },
    desc: {
      title: '描述(desc)',
      type: 'string',
      default: '',
    },
    initAction: {
      title: '初始接口(initAction)',
      type: 'string',
      default: null,
    },
    linkAction: {
      title: '联动接口(linkAction)',
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
      default: null,
      widget: 'simpleList',
    },
    placeholder: {
      title: '组件提示信息(placeholder)',
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
    hiddenType: {
      title: '点击单选组件隐藏语法类型',
      type: 'string',
      widget: 'radio',
      props: {
        options: [
          { label: '=== + &&', value: 'equal' },
          { label: '!== + &&', value: 'unequal' },
          { label: '=== + ||', value: 'equalOr' },
          { label: '!== + ||', value: 'unequalOr' },
          { label: 'includes', value: 'includes' },
        ],
      },
      default: 'equal',
    },
    hidden: {
      title: '组件隐藏（hidden）',
      type: 'string',
      default: '',
    },
  };

  return (
    <div style={{ height: '80vh' }}>
      <Generator
        ref={ref}
        extraButtons={[{ text: '查看', onClick: () => onClick() }]}
        globalSettings={null}
        widgets={{ NewWidget }}
        settings={settings}
        commonSettings={commonSettings}
      />
    </div>
  );
};

export default RormRender;
