import { language } from '@/env';

const WEEK_MAP = {
	'zh-CN': Object.freeze(['日', '一', '二', '三', '四', '五', '六']),
	en: Object.freeze(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
};

export const WEEK = () =>
	WEEK_MAP[language.get() as keyof typeof WEEK_MAP] || WEEK_MAP['zh-CN'];

// prettier-ignore
const MONTH_MAP = {
	'zh-CN': Object.freeze(['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']),
	en: Object.freeze(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']),
}

export const MONTH = () =>
	MONTH_MAP[language.get() as keyof typeof MONTH_MAP] || MONTH_MAP['zh-CN'];
