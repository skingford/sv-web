import type { PageLoad } from './$types';

// 模拟成员数据类型
export interface Member {
	id: string;
	username: string;
	displayName: string;
	avatar: string;
	isPrivate: boolean;
	role: 'Member' | 'Owner' | 'Admin';
	teams: number;
}

// 模拟数据
const mockMembers: Member[] = [
	{
		id: '1',
		username: '970299422',
		displayName: '量均',
		avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '2',
		username: 'aatoe',
		displayName: 'Juice「郭浩航」',
		avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '3',
		username: 'Anilfun',
		displayName: '何佳敏',
		avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '4',
		username: 'crawl-dj',
		displayName: 'dingjun',
		avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '5',
		username: 'evisx',
		displayName: '白荣刚',
		avatar: 'https://avatars.githubusercontent.com/u/5?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '6',
		username: 'Github-newbee',
		displayName: '何林涛',
		avatar: 'https://avatars.githubusercontent.com/u/6?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '7',
		username: 'heqianwu',
		displayName: '何情武',
		avatar: 'https://avatars.githubusercontent.com/u/7?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '8',
		username: 'jyriba',
		displayName: 'Xu Jiayu',
		avatar: 'https://avatars.githubusercontent.com/u/8?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	},
	{
		id: '9',
		username: 'karoboflower',
		displayName: '王春彬',
		avatar: 'https://avatars.githubusercontent.com/u/9?v=4',
		isPrivate: true,
		role: 'Member',
		teams: 0
	}
];

export const load: PageLoad = ({ params }) => {
	return {
		name: params.name,
		members: mockMembers,
		totalCount: mockMembers.length
	};
};
