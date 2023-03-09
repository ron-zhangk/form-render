import Generator, {
  defaultCommonSettings,
  defaultGlobalSettings,
  defaultSettings,
} from 'fr-generator';
import React, { useRef } from 'react';
import { keyBy, zipWith } from 'lodash';
import './styles.css';
import { Button, message } from 'antd';

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
    const o = keyBy(v, 'name');
    const noName = v?.find((k: any) => !k.name);
    console.log('noName----------------', noName);
    if (noName) {
      message.error('存在没有name的组件');
      return;
    }
    let arr = [];
    v?.map((item: any) => {
      const { enum: _enum, enumNames, hidden, selectValue, title, widget, ...others } = item;
      // const s = zipWith(_enum, enumNames,)
      let obj = {
        ...others,
        label: title,
        type: widget,
      };
      console.log('obj----------------', obj);
    });
    console.log('v========', v, o);
  };

  return (
    <div style={{ height: '80vh' }}>
      <Generator
        ref={ref}
        extraButtons={[{ text: '查看', onClick: () => onClick() }]}
        globalSettings={null}
        widgets={{ NewWidget }}
        settings={[
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
                  hidden: {
                    title: '组件隐藏（hidden）',
                    type: 'string',
                    default: '',
                  },
                },
              },
            ],
          },
        ]}
        commonSettings={{
          name: {
            title: '组件名称（name）',
            type: 'string',
            required: true,
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
            type: 'string',
            default: null,
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
        }}
      />
    </div>
  );
};

export default RormRender;
