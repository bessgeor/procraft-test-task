import { ApiDayAbbreviations, Response, Studio, StudioScheduleDay, StudioScheduleDays, TimeInterval } from "./stub-data"
import { Time } from "./time"

export type MappedTimeInterval = {
	from: Time
	to: Time
}

export type MappedStudioScheduleDays = {
	[K in keyof StudioScheduleDays]:
		K extends 'commonBreak'	? MappedTimeInterval | null
		: K extends 'studioSchedules' ? (Omit<StudioScheduleDay, 'workingTimes'> & {
			workingTimes: MappedTimeInterval[]
		})[]
		: StudioScheduleDays[K]
}


export type MappedResponse =
	Omit<Response, 'schedule'> & {
		schedule: [ApiDayAbbreviations, MappedStudioScheduleDays][]
	}

// i18n incompatible: update to (1) use user's first day in week, (2) get day names based on the user's locale
export const dayNamingMap: Record<ApiDayAbbreviations, string> = {
	mon: 'Понедельник',
	tue: 'Вторник',
	wed: 'Среда',
	thu: 'Четверг',
	fri: 'Пятница',
	sat: 'Суббота',
	sun: 'Воскресенье'
}

function tryParseInterval(interval: TimeInterval | null): MappedTimeInterval | null {
	if (!interval) return null
	const from = Time.parse(interval.from)
	const to = Time.parse(interval.to)
	return from && to && { from, to }
}

function mapScheduleDay(day: StudioScheduleDays, studios: Studio[]): MappedStudioScheduleDays {
	const commonBreak = tryParseInterval(day.commonBreak)

	const dayStudioMap = new Map(day.studioSchedules.map(x => [x.studioId, x.workingTimes]))

	return {
		commonBreak,
		studioSchedules: studios.map(x => ({
			studioId: x.id,
			workingTimes:
				dayStudioMap
					.get(x.id)
					?.map(tryParseInterval)
					?.filter(x => !!x)
					?.map(x => x!)
					?? []
		}))
	}
}

function mapSchedule({schedule, studios}: Response): [ApiDayAbbreviations, MappedStudioScheduleDays][] {
	const result: ReturnType<typeof mapSchedule> = []
	for (const k in Object.keys(dayNamingMap)) {
		const key = k as ApiDayAbbreviations
		if (key in schedule && schedule[key] !== undefined)
			result.push([key, mapScheduleDay(schedule[key]!, studios)])
		else result.push([key, { commonBreak: null, studioSchedules: studios.map(x => ({ studioId: x.id, workingTimes: [] }))}])
	}
	return result
}

export function mapResponse(r: Response): MappedResponse {
	return {
		studios: r.studios,
		schedule: mapSchedule(r)
	}
}

