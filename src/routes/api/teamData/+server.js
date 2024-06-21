import fs from 'fs';
import path from 'path';

export async function GET() {
	const teamDirectory = path.resolve('static/images/team'); // Updated path
	try {
		const teamFiles = fs.readdirSync(teamDirectory);
		const teamData = teamFiles
			.filter((file) => path.extname(file).toLowerCase() === '.png')
			.map((file) => {
				const name = path.parse(file).name;
				const img = path.join('/images/team', encodeURIComponent(file)); // Direct URL path
				return { name, img };
			});

		return new Response(JSON.stringify(teamData), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		console.error('Error reading team directory:', error);
		return new Response(JSON.stringify({ error: 'Could not read team directory' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
