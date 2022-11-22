export const arrayChunk = (array: any[], chunkSize = 1) => {
	if (chunkSize < 1) {
		throw new Error('Chunk size must be greater then 0');
	}
	if (chunkSize === 1) {
		return [[...array]];
	}
	const chunks = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		const chunk = array.slice(i, i + chunkSize);
		chunks.push(chunk);
	}
	return chunks;
}