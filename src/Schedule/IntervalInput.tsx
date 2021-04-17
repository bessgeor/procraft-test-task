import React from 'react'
import { MappedTimeInterval } from './mapResponse'

type IntervalInputProps = {
	interval: MappedTimeInterval | null
	onChange: MappedTimeInterval
}

export function IntervalInput({ interval, onChange }: IntervalInputProps) {
	const [from, setFrom] = React.useState(() => interval && interval.from.toString())
	const [to, setTo] = React.useState(() => interval && interval.to.toString())
}