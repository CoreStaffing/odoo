/**
 * This is a cloud function triggered upon new writes to the data backup bucket.
 * New activity triggers the function to examine the contents of the bucket and
 * eject any files older than 30 days.
 */

'use strict';

const gcs = require('@google-cloud/storage')();

/**
 * Background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 */
exports.deleteOldFiles = (event) => {
	const bucket = gcs.bucket('odoo-backups');

	let promises = [];
	bucket.getFiles({versions: false}, (err, files) => {
		// if error log and return
		if (err) {
			console.error(err);
			return;
		}

		// get current time, in milliseconds
		const now = new Date().getTime();
		// thirty days is 1000 milliseconds * 60 seconds * 60 minutes * 24 hours * 30 days 
		const thirtyDays = 1000 * 60 * 60 * 24 * 30;

		// iterate over each file in bucket and check for files older than 30 days
		for (var i = 0; i < files.length; i++) {
			files[i].getMetadata().then(data => {
				const lastUpdated = Date.parse(data[0].updated);
				const filename = data[0].name;
				if (now - lastUpdated > thirtyDays) {
					// if more than 30 days old then delete
					console.info(`${filename}: will delete because last updated at ${lastUpdated}`);
					promises.push(bucket.file(filename).delete());
				} else {
					console.info(`${filename}: keep`);
				}
			});
		}
	});

	// wait for any accumulated promises to finish
	return Promise.all(promises);
};
