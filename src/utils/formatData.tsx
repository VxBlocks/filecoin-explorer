const DateUtil = {
  formatDate(strDate?: any, strFormat?: any) {
    if (!strDate) { return; }
    if (!strFormat) { strFormat = 'yyyy-MM-dd'; }
    switch (typeof strDate) {
      case 'string':
        strDate = new Date(strDate.replace(/-/, '/'))
        break;
      case 'number':
        strDate = new Date(strDate * 1000);
        break;
    }
    if (strDate instanceof Date) {
      const dict: any = {
        yyyy: strDate.getFullYear(),
        M: strDate.getMonth() + 1,
        d: strDate.getDate(),
        H: strDate.getHours(),
        m: strDate.getMinutes(),
        s: strDate.getSeconds(),
        MM: ('' + (strDate.getMonth() + 101)).substring(1),
        dd: ('' + (strDate.getDate() + 100)).substring(1),
        HH: ('' + (strDate.getHours() + 100)).substring(1),
        mm: ('' + (strDate.getMinutes() + 100)).substring(1),
        ss: ('' + (strDate.getSeconds() + 100)).substring(1)
      };

      return strFormat.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, function () {
        return dict[arguments[0]];
      });
    }
  },

  dateStringToTimesTamp(data: string) {
    let newData = data;
    newData = newData.substring(0, 19);
    newData = newData.replace(/-/g, '/');
    return new Date(newData).getTime();
  }
}


export default DateUtil