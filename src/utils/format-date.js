const formatter = new Intl.DateTimeFormat('tr-TR', {
	day: 'numeric',
	month: 'long',
	year: 'numeric',
});

export function formatDate(value) {
	if (!value) {
		return '';
	}

	return formatter.format(new Date(value));
}
