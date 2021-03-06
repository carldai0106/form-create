import {BaseParser} from '@form-create/core';
import {timeStampToDate, $set} from '@form-create/utils';

export default class Parser extends BaseParser {
    init() {
        let props = this.rule.props;
        if ((props.startDate))
            $set(props, 'startDate', timeStampToDate(props.startDate));
    }

    isRange() {
        return this.el.type.includes('range') || this.el.multiple;
    }

    _toValue(val) {
        const value = this.el.formatDate(val || ''), {separator} = this.el,
            isRange = this.isRange();
        if (!value)
            return isRange ? (this.el.multiple ? [] : ['', '']) : value;
        else if (isRange)
            return value.split(separator);
        else
            return value;
    }

    toValue(formValue) {
        const el = this.$handle.vm.$refs[this.refName];
        if (el) {
            this.el = el;
            return this._toValue(formValue);
        }
        return super.toValue(formValue);
    }

    mounted() {
        this.toFormValue = (val) => {
            let v = this.el.parseDate(val);
            return this.isRange() ? v : v[0];
        };

        this.toValue = this._toValue;
    }
}
