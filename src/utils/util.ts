import { zipWith } from 'lodash';

export function fnInitData({ initAction, _enum, enumNames, selectValue }: any) {
  let value = null;
  if (initAction) {
    value = [];
  }
  if (_enum?.length && enumNames?.length) {
    value = zipWith(_enum, enumNames, (code, name) => ({
      code,
      name,
      selected: code === selectValue ?? false,
    }));
  }
  return value;
}

function fnGetValueArr(item: any, properties: any) {
  const item0 = item?.[0]?.trim();
  const item1 = item?.[1]?.trim();
  const first = item0?.substr(10);
  const second = item1.slice(1, item1?.length - 1);
  return { first, second };
}

export function fnHidden({ hidden, properties, hiddenType }: any) {
  let valueArr: any = [];
  switch (hiddenType) {
    case 'equal':
      const equal_h = hidden?.slice(2, hidden?.length - 2).split('&&');
      equal_h?.forEach((v: any) => {
        const item = v?.split('===');
        const { first, second } = fnGetValueArr(item, properties);
        valueArr.push({ mNmae: properties[first]?.name, mValue: second });
      });
      return { hiddenType, values: valueArr };
    case 'unequal':
      const unequal_h = hidden?.slice(2, hidden?.length - 2).split('&&');
      unequal_h?.forEach((v: any) => {
        const item = v?.split('!==');
        const { first, second } = fnGetValueArr(item, properties);
        valueArr.push({ mNmae: properties[first]?.name, mValue: second });
      });
      return { hiddenType, values: valueArr };
    case 'equalOr':
      const equalOr_h = hidden?.slice(2, hidden?.length - 2).split('||');
      equalOr_h?.forEach((v: any) => {
        const item = v?.split('===');
        const { first, second } = fnGetValueArr(item, properties);
        valueArr.push({ mNmae: properties[first]?.name, mValue: second });
      });
      return { hiddenType, values: valueArr };
    case 'unequalOr':
      const unequalOr_h = hidden?.slice(2, hidden?.length - 2).split('&&');
      unequalOr_h?.forEach((v: any) => {
        const item = v?.split('!==');
        const { first, second } = fnGetValueArr(item, properties);
        valueArr.push({ mNmae: properties[first]?.name, mValue: second });
      });
      return { hiddenType, values: valueArr };

    default:
      return { hiddenType, values: valueArr };
  }
}
