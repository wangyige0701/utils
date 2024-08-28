import { languageInfo } from '@/env';

const WEEK_MAP = {
	'zh-CN': Object.freeze(['日', '一', '二', '三', '四', '五', '六']),
	en: Object.freeze(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
};

export const WEEK =
	WEEK_MAP[languageInfo.value as keyof typeof WEEK_MAP] || WEEK_MAP['zh-CN'];
