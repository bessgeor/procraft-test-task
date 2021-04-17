import React from 'react'
import { MappedResponse, MappedStudioScheduleDays, mapResponse } from './mapResponse'
import { ApiDayAbbreviations, Response, stubData } from './stub-data'

function defaultScheduleDay(name: ApiDayAbbreviations): MappedResponse['schedule'][number] {
	return [name, {
		commonBreak: null,
		studioSchedules: []
	}]
}
const defaultSchedule = [
	defaultScheduleDay('mon'),
	defaultScheduleDay('tue'),
	defaultScheduleDay('wed'),
	defaultScheduleDay('thu'),
	defaultScheduleDay('fri'),
	defaultScheduleDay('sat'),
	defaultScheduleDay('sun'),
]

type SubmitType = Partial<Record<ApiDayAbbreviations, MappedStudioScheduleDays>>

function mapToServerFormat(schedule: typeof defaultSchedule): SubmitType {
	const result: SubmitType = {}
	for (const [day, value] of schedule)
		result[day] = value
	return result
}

export function useScheduleState() {
	const [schedule, setSchedule] = React.useState(defaultSchedule)
	const [studioNames, setStudioNames] = React.useState(() => new Map<number, string>([]))

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			const { schedule, studios } = mapResponse(stubData)
			setSchedule(schedule)
			setStudioNames(new Map(studios.map(x => [x.id, x.name])))
		}, 100)
		return () => clearTimeout(timeout) // request cancellation here
	})

	const updateDay = React.useCallback((newValue: typeof defaultSchedule[number]) =>
		setSchedule(old => old.map(old => old[0] === newValue[0] ? newValue : old))
	, [setSchedule])

	const submit = React.useCallback(() => alert(JSON.stringify(mapToServerFormat(schedule))), [schedule])

	return {
		schedule,
		studioNames,
		updateDay,
		submit
	}
}
