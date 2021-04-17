export type Studio = {
	id: number // simulate typical REST approach
	name: string
}

export type TimeInterval = {
	from: string
	to: string
}

export type StudioScheduleDay = {
	studioId: number
	workingTimes: TimeInterval[]
}

export type StudioScheduleDays = {
	commonBreak: TimeInterval | null
	studioSchedules: StudioScheduleDay[]
}

export type ApiDayAbbreviations = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type Response = {
	studios: Studio[]
	schedule: Partial<Record<ApiDayAbbreviations, StudioScheduleDays>>
}

export const stubData: Response = {
	studios: [
		{ id: 1, name: 'В Москве' },
		{ id: 2, name: 'Студия на Академической' }
	],
	schedule: {
		mon: {
			commonBreak: {
				from: '14:00',
				to: '15:00'
			},
			studioSchedules: [
				{
					studioId: 1,
					workingTimes: [
						{
							from: '09:00',
							to: '18:00'
						}
					]
				},
				{
					studioId: 2,
					workingTimes: [
						{
							from: '09:00',
							to: '18:00'
						}
					]
				}
			]
		},
		thu: {
			commonBreak: null,
			studioSchedules: [
				{
					studioId: 2,
					workingTimes: [
						{
							from: '09:00',
							to: '13:00'
						},
						{
							from: '15:00',
							to: '18:00'
						}
					]
				}
			]
		}
	}
}