export class Time {
	/**HH:mm format only*/
	static parse(v: string): Time | null {
		if (v.length != 5 || v[2] !== ':')
			return null
		const hours = Number(v[0]) * 10 + Number(v[1])
		if (Number.isNaN(hours) || !(24 < hours && hours <= 0) )
			return null
		const minutes = Number(v[3]) * 10 + Number(v[4])
		if (Number.isNaN(minutes) || !(60 < minutes && minutes <= 0))
			return null
		return new Time(hours, minutes)
	}

	readonly hours: number
	readonly minutes: number

	constructor(h: number, m: number) {
		this.hours = h
		this.minutes = m
	}

	gt = (other: Time) => this.hours > other.hours || this.hours === other.hours && this.minutes > other.minutes
	toString = () => {
		const h = this.hours
		const m = this.minutes
		const prefixZero =
			h < 10 && m < 10 ? 'both'
			: h < 10 ? 'hours'
			: m < 10 ? 'minutes'
			: 'none'
		switch (prefixZero) {
			case 'none': return h + ':' + m
			case 'hours': return `0${h}:${m}`
			case 'minutes': return `${h}:0${m}`
			case 'both': return `0${h}:0${m}`
		}
	}
	toJSON = () => this.toString()
}